import { useState, useEffect } from 'react';
import { Shield, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export function PrivacyTimer() {
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [isVisible, setIsVisible] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Simulate document upload detection
    const uploadDetected = setTimeout(() => {
      setIsVisible(true);
    }, 2000);

    return () => clearTimeout(uploadDetected);
  }, []);

  useEffect(() => {
    if (!isVisible || timeRemaining <= 0) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleDestroy();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isVisible, timeRemaining]);

  const handleDestroy = () => {
    // Simulate privacy destruction process
    console.log('[INFO] Starting privacy destruction process...');
    
    // 1. Revoke Blob URLs
    console.log('[INFO] Revoking Blob URLs...');
    
    // 2. Clear IndexedDB
    console.log('[INFO] Clearing IndexedDB...');
    
    // 3. Destroy crypto keys
    console.log('[INFO] Destroying Web Crypto API keys...');
    
    // Complete
    setTimeout(() => {
      console.log('[INFO] Document blob destroyed');
      setIsDestroyed(true);
      
      // Hide notification after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 500);
  };

  if (!isVisible) return null;

  const getStatusColor = () => {
    if (isDestroyed) return 'green';
    if (timeRemaining <= 10) return 'red';
    if (timeRemaining <= 20) return 'amber';
    return 'blue';
  };

  const statusColor = getStatusColor();

  return (
    <>
      {/* Floating Timer Badge */}
      <div className="fixed bottom-6 right-6 z-40">
        <div
          onClick={() => setShowDetails(!showDetails)}
          className={`px-4 py-3 rounded-2xl shadow-2xl cursor-pointer transition-all hover:scale-105 ${
            isDestroyed
              ? 'bg-gradient-to-r from-green-500 to-emerald-600'
              : statusColor === 'red'
              ? 'bg-gradient-to-r from-red-500 to-rose-600 animate-pulse'
              : statusColor === 'amber'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
          }`}
        >
          <div className="flex items-center gap-3 text-white">
            <div className="size-10 rounded-full bg-white/20 flex items-center justify-center">
              {isDestroyed ? (
                <CheckCircle className="size-5" />
              ) : timeRemaining <= 10 ? (
                <AlertTriangle className="size-5" />
              ) : (
                <Clock className="size-5" />
              )}
            </div>
            <div>
              <div className="text-xs opacity-90">隐私保护</div>
              <div className="text-lg font-bold">
                {isDestroyed ? '已销毁' : `${timeRemaining}秒`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Panel */}
      {showDetails && (
        <div className="fixed bottom-24 right-6 z-40 w-96">
          <div className="bg-white rounded-2xl shadow-2xl border-2 border-neutral-200 overflow-hidden">
            {/* Header */}
            <div className={`px-5 py-4 ${
              isDestroyed
                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                : 'bg-gradient-to-r from-blue-500 to-indigo-600'
            }`}>
              <div className="flex items-center gap-3 text-white">
                <Shield className="size-6" />
                <div>
                  <h3 className="font-semibold text-base">隐私保护机制</h3>
                  <p className="text-xs opacity-90">
                    {isDestroyed ? '数据已完全销毁' : '自动销毁倒计时'}
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {!isDestroyed ? (
                <>
                  {/* Timer */}
                  <div className="text-center">
                    <div className={`text-5xl font-bold mb-2 ${
                      timeRemaining <= 10 ? 'text-red-600' : 'text-blue-600'
                    }`}>
                      {timeRemaining}
                    </div>
                    <div className="text-sm text-neutral-600">秒后自动销毁所有上传文档</div>
                  </div>

                  {/* Progress Ring */}
                  <div className="flex justify-center">
                    <div className="relative size-32">
                      <svg className="size-full -rotate-90" viewBox="0 0 100 100">
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke="#e5e7eb"
                          strokeWidth="8"
                        />
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="none"
                          stroke={timeRemaining <= 10 ? '#dc2626' : '#2563eb'}
                          strokeWidth="8"
                          strokeDasharray={`${(timeRemaining / 30) * 283} 283`}
                          className="transition-all duration-1000"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Clock className={`size-8 ${
                          timeRemaining <= 10 ? 'text-red-600' : 'text-blue-600'
                        }`} />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="py-4 text-center">
                  <div className="size-16 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="size-8 text-green-600" />
                  </div>
                  <h4 className="text-base font-semibold text-neutral-900 mb-1">
                    销毁完成
                  </h4>
                  <p className="text-sm text-neutral-600">
                    所有文档数据已安全清除
                  </p>
                </div>
              )}

              {/* Checklist */}
              <div className="space-y-2">
                <div className="text-xs text-neutral-500 font-medium mb-2">安全措施：</div>
                {[
                  { label: 'Blob URL 撤销', done: isDestroyed },
                  { label: 'IndexedDB 清空', done: isDestroyed },
                  { label: 'AES-256密钥销毁', done: isDestroyed },
                  { label: '控制台日志验证', done: isDestroyed }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    {item.done ? (
                      <CheckCircle className="size-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <Clock className="size-4 text-blue-600 flex-shrink-0" />
                    )}
                    <span className={`text-sm ${
                      item.done ? 'text-green-900 font-medium' : 'text-neutral-700'
                    }`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer Note */}
              <div className="pt-3 border-t border-neutral-200">
                <p className="text-xs text-neutral-500 leading-relaxed">
                  {isDestroyed ? (
                    <>
                      ✅ 已完成ISO 27001附录A.8.2.3审计项要求
                      <br />
                      ✅ 数据零落盘，完全符合隐私合规标准
                    </>
                  ) : (
                    <>
                      ⚠️ 文档解析全程在本地完成
                      <br />
                      ⚠️ 原始文件不离开用户设备或边缘网关
                    </>
                  )}
                </p>
              </div>

              {/* Action */}
              {!isDestroyed && (
                <button
                  onClick={handleDestroy}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg font-medium transition-colors"
                >
                  立即销毁
                </button>
              )}
            </div>

            {/* Close Button */}
            <button
              onClick={() => setShowDetails(false)}
              className="w-full py-2 text-xs text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors"
            >
              收起详情
            </button>
          </div>
        </div>
      )}
    </>
  );
}
