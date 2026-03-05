import { User, ChevronDown } from 'lucide-react';
import { Member } from '../types/member';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface MemberSelectorProps {
  members: Member[];
  currentMemberId: string;
  onMemberChange: (memberId: string) => void;
}

export function MemberSelector({ members, currentMemberId, onMemberChange }: MemberSelectorProps) {
  if (members.length === 0) {
    return (
      <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
        <User className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-500">暂无成员</span>
      </div>
    );
  }

  const currentMember = members.find(m => m.id === currentMemberId);

  return (
    <Select value={currentMemberId} onValueChange={onMemberChange}>
      <SelectTrigger className="w-[200px]">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-gray-600" />
          <SelectValue>
            {currentMember?.name || '选择成员'}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent>
        {members.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            <div className="flex items-center justify-between w-full">
              <span>{member.name}</span>
              {member.lastUpdated && (
                <span className="text-xs text-gray-400 ml-4">
                  {new Date(member.lastUpdated).toLocaleDateString()}
                </span>
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
