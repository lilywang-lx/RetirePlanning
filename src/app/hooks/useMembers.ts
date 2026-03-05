import { useState, useEffect } from 'react';
import { Member, HealthRecord } from '../types/member';

const STORAGE_KEY_MEMBERS = 'health_members';
const STORAGE_KEY_RECORDS = 'health_records';

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [currentMemberId, setCurrentMemberId] = useState<string>('');

  // 初始化加载成员列表
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_MEMBERS);
    if (stored) {
      const loadedMembers = JSON.parse(stored) as Member[];
      setMembers(loadedMembers);
      // 默认选择第一个成员
      if (loadedMembers.length > 0 && !currentMemberId) {
        setCurrentMemberId(loadedMembers[0].id);
      }
    }
  }, []);

  // 保存成员列表到localStorage
  const saveMembers = (newMembers: Member[]) => {
    setMembers(newMembers);
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(newMembers));
  };

  // 创建新成员
  const createMember = (name: string): Member => {
    const newMember: Member = {
      id: `member_${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
    };
    const updatedMembers = [...members, newMember];
    saveMembers(updatedMembers);
    
    // 如果是第一个成员，自动选中
    if (members.length === 0) {
      setCurrentMemberId(newMember.id);
    }
    
    return newMember;
  };

  // 更新成员最后更新时间
  const updateMemberLastUpdated = (memberId: string) => {
    const updatedMembers = members.map(m => 
      m.id === memberId 
        ? { ...m, lastUpdated: new Date().toISOString() }
        : m
    );
    saveMembers(updatedMembers);
  };

  // 获取当前成员
  const currentMember = members.find(m => m.id === currentMemberId);

  return {
    members,
    currentMember,
    currentMemberId,
    setCurrentMemberId,
    createMember,
    updateMemberLastUpdated,
  };
}

export function useHealthRecords(memberId?: string) {
  const [records, setRecords] = useState<HealthRecord[]>([]);

  // 加载健康记录
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (stored) {
      const allRecords = JSON.parse(stored) as HealthRecord[];
      // 如果指定了memberId，只返回该成员的记录
      const filteredRecords = memberId 
        ? allRecords.filter(r => r.memberId === memberId)
        : allRecords;
      setRecords(filteredRecords);
    }
  }, [memberId]);

  // 保存健康记录
  const saveRecord = (record: HealthRecord) => {
    const stored = localStorage.getItem(STORAGE_KEY_RECORDS);
    const allRecords = stored ? JSON.parse(stored) as HealthRecord[] : [];
    const updatedRecords = [...allRecords, record];
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(updatedRecords));
    
    // 更新本地state
    if (!memberId || record.memberId === memberId) {
      setRecords(prev => [...prev, record]);
    }
  };

  // 获取最新的记录
  const latestRecord = records.length > 0 
    ? records.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
    : null;

  return {
    records,
    latestRecord,
    saveRecord,
  };
}
