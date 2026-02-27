import { useState } from 'react';
import { Edit2, Plus, Trash2, FileText, Save, X } from 'lucide-react';
import { SlideData } from '@/app/App';

interface PreviewPanelProps {
  slides: SlideData[];
  updateSlide: (slideId: string, updates: Partial<SlideData>) => void;
}

export function PreviewPanel({ slides, updateSlide }: PreviewPanelProps) {
  const [editingSlide, setEditingSlide] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState<string[]>([]);
  const [editNotes, setEditNotes] = useState('');

  const startEdit = (slide: SlideData) => {
    setEditingSlide(slide.id);
    setEditTitle(slide.title);
    setEditContent([...slide.content]);
    setEditNotes(slide.notes);
  };

  const saveEdit = () => {
    if (editingSlide) {
      updateSlide(editingSlide, {
        title: editTitle,
        content: editContent,
        notes: editNotes
      });
      setEditingSlide(null);
    }
  };

  const cancelEdit = () => {
    setEditingSlide(null);
  };

  const addContentItem = () => {
    setEditContent([...editContent, '']);
  };

  const updateContentItem = (index: number, value: string) => {
    const newContent = [...editContent];
    newContent[index] = value;
    setEditContent(newContent);
  };

  const removeContentItem = (index: number) => {
    setEditContent(editContent.filter((_, i) => i !== index));
  };

  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <FileText className="size-16 text-neutral-300 mx-auto mb-4" />
          <p className="text-neutral-500 text-sm">与AI对话生成您的PPT大纲</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-neutral-100 py-8">
      <div className="max-w-5xl mx-auto space-y-6 px-8">
        {slides.map((slide, index) => {
          const isEditing = editingSlide === slide.id;
          
          return (
            <div
              key={slide.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-neutral-200"
              style={{ aspectRatio: '16/9' }}
            >
              {isEditing ? (
                // Edit Mode
                <div className="h-full flex flex-col">
                  {/* Edit Header */}
                  <div className="px-6 py-4 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="text-lg font-semibold text-neutral-900 bg-white border border-blue-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="页面标题"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={cancelEdit}
                        className="px-4 py-2 text-sm text-neutral-700 hover:bg-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <X className="size-4" />
                        取消
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 font-medium"
                      >
                        <Save className="size-4" />
                        保存
                      </button>
                    </div>
                  </div>

                  {/* Edit Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    <div className="space-y-3">
                      <label className="text-xs font-medium text-neutral-700">页面内容：</label>
                      {editContent.map((item, idx) => (
                        <div key={idx} className="flex gap-2">
                          <div className="flex-shrink-0 size-6 rounded bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium mt-2">
                            {idx + 1}
                          </div>
                          <textarea
                            value={item}
                            onChange={(e) => updateContentItem(idx, e.target.value)}
                            className="flex-1 px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                            placeholder="输入内容..."
                          />
                          {editContent.length > 1 && (
                            <button
                              onClick={() => removeContentItem(idx)}
                              className="flex-shrink-0 size-8 hover:bg-red-50 text-red-500 rounded flex items-center justify-center transition-colors mt-2"
                            >
                              <Trash2 className="size-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={addContentItem}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                      >
                        <Plus className="size-4" />
                        添加内容项
                      </button>
                    </div>

                    <div className="mt-6 space-y-2">
                      <label className="text-xs font-medium text-neutral-700">演讲备注：</label>
                      <textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={2}
                        placeholder="输入演讲时的口述要点..."
                      />
                    </div>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="h-full flex flex-col">
                  {/* Slide Header */}
                  <div className="px-8 py-6 border-b border-neutral-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-lg font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-neutral-900">{slide.title}</h3>
                        {slide.isEdited && (
                          <span className="text-xs text-blue-600 font-medium">已编辑</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => startEdit(slide)}
                      className="px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Edit2 className="size-4" />
                      编辑
                    </button>
                  </div>

                  {/* Slide Content */}
                  <div className="flex-1 px-8 py-6 overflow-y-auto">
                    {slide.type === 'cover' ? (
                      <div className="h-full flex flex-col items-center justify-center text-center">
                        <h1 className="text-4xl font-bold text-neutral-900 mb-6">{slide.title}</h1>
                        {slide.content.map((line, idx) => (
                          <p key={idx} className="text-xl text-neutral-600 mb-2">{line}</p>
                        ))}
                      </div>
                    ) : slide.type === 'toc' ? (
                      <div className="space-y-4">
                        {slide.content.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 py-3">
                            <div className="size-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                              {idx + 1}
                            </div>
                            <span className="text-lg text-neutral-800">{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {slide.content.map((item, idx) => (
                          <div key={idx} className="flex gap-4">
                            <div className="flex-shrink-0 size-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                              {idx + 1}
                            </div>
                            <p className="text-lg text-neutral-800 leading-relaxed flex-1 pt-0.5">{item}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Slide Notes */}
                  <div className="px-8 py-4 bg-amber-50 border-t border-amber-200">
                    <div className="flex items-start gap-2">
                      <FileText className="size-4 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-medium text-amber-900 mb-1">演讲备注</div>
                        <p className="text-sm text-amber-800">{slide.notes}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}