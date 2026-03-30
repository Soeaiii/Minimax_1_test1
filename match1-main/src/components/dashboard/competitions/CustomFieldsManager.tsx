'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CustomFieldDefinition {
  name: string;
  type: 'text' | 'number' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface CustomFieldsManagerProps {
  competitionId: string;
  initialFields?: CustomFieldDefinition[];
  onSave?: (fields: CustomFieldDefinition[]) => void;
  readOnly?: boolean;
}

export function CustomFieldsManager({
  competitionId,
  initialFields = [],
  onSave,
  readOnly = false
}: CustomFieldsManagerProps) {
  const [fields, setFields] = useState<CustomFieldDefinition[]>(initialFields);
  const [isLoading, setIsLoading] = useState(false);

  // 加载自定义字段定义
  useEffect(() => {
    const loadFields = async () => {
      if (initialFields.length > 0) {
        setFields(initialFields);
        return;
      }

      if (!competitionId) return;

      try {
        setIsLoading(true);
        const response = await fetch(`/api/competitions/${competitionId}/custom-fields`);
        
        if (response.ok) {
          const data = await response.json();
          if (data.competition.customFieldDefinitions) {
            const definitions = JSON.parse(data.competition.customFieldDefinitions);
            setFields(definitions);
          }
        } else {
          console.error("Error loading custom fields");
        }
      } catch (error) {
        console.error("Error loading custom fields:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFields();
  }, [competitionId, initialFields]);

  // 添加自定义字段
  const addField = () => {
    if (readOnly) return;
    setFields([
      ...fields,
      { name: "", type: "text", required: false, placeholder: "" }
    ]);
  };

  // 移除自定义字段
  const removeField = (index: number) => {
    if (readOnly) return;
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  // 更新自定义字段
  const updateField = (index: number, field: string, value: any) => {
    if (readOnly) return;
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [field]: value };
    setFields(newFields);
  };

  // 保存自定义字段定义
  const saveFields = async () => {
    if (readOnly) return;
    
    // 验证字段名称不能为空
    const invalidFields = fields.filter(f => !f.name.trim());
    if (invalidFields.length > 0) {
      toast.error("字段名称不能为空");
      return;
    }

    try {
      setIsLoading(true);
      
      // 如果有onSave回调，直接调用
      if (onSave) {
        onSave(fields);
        return;
      }

      // 否则直接保存到API
      const response = await fetch(`/api/competitions/${competitionId}/custom-fields`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customFieldDefinitions: JSON.stringify(fields),
        }),
      });

      if (response.ok) {
        toast.success("自定义字段已保存");
      } else {
        const error = await response.json();
        throw new Error(error.error || "保存失败");
      }
    } catch (error: any) {
      toast.error(error.message || "保存自定义字段失败");
      console.error("Error saving custom fields:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">节目自定义字段</h3>
        {!readOnly && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addField}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4 mr-2" />
              添加字段
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={saveFields}
              disabled={isLoading}
            >
              保存字段
            </Button>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        定义所有节目共用的自定义字段，例如表演时长、道具需求等。这些字段将在节目表单中显示。
      </p>

      {fields.length === 0 && (
        <p className="text-sm text-muted-foreground">
          暂无自定义字段{!readOnly && '，点击"添加字段"按钮创建'}
        </p>
      )}

      {fields.map((field, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4 border p-4 rounded-lg">
          <div>
            <label className="text-sm font-medium">
              字段名称 *
            </label>
            <Input
              value={field.name}
              onChange={(e) => updateField(index, 'name', e.target.value)}
              placeholder="例如：表演时长"
              className="mt-1"
              disabled={readOnly}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">
              字段类型 *
            </label>
            <Select
              value={field.type}
              onValueChange={(value) => updateField(index, 'type', value as 'text' | 'number' | 'select')}
              disabled={readOnly}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="选择类型" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">文本</SelectItem>
                <SelectItem value="number">数字</SelectItem>
                <SelectItem value="select">选择项</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium">
              提示文本
            </label>
            <Input
              value={field.placeholder || ''}
              onChange={(e) => updateField(index, 'placeholder', e.target.value)}
              placeholder="请输入..."
              className="mt-1"
              disabled={readOnly}
            />
          </div>
          
          <div>
            <div className="flex items-center mt-4">
              <Checkbox
                id={`required-${index}`}
                checked={field.required}
                onCheckedChange={(checked) => updateField(index, 'required', Boolean(checked))}
                disabled={readOnly}
              />
              <label htmlFor={`required-${index}`} className="ml-2 text-sm">
                必填字段
              </label>
            </div>
          </div>

          {!readOnly && (
            <div className="flex justify-end items-end md:h-full">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeField(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {field.type === 'select' && (
            <div className="col-span-5 mt-2">
              <label className="text-sm font-medium">
                选项值（使用逗号分隔）
              </label>
              <Input
                value={(field.options || []).join(',')}
                onChange={(e) => updateField(index, 'options', e.target.value.split(',').map(item => item.trim()))}
                placeholder="选项1,选项2,选项3"
                className="mt-1"
                disabled={readOnly}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 