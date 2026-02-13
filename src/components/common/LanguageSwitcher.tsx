import React from 'react';
import { Select, Space } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { LANGUAGES, LanguageCode } from '../../constants/languages';

export const LanguageSwitcher: React.FC = () => {
  const { currentLanguage, setLanguage } = useTranslation();

  return (
    <Select
      value={currentLanguage}
      onChange={(value) => setLanguage(value as LanguageCode)}
      options={Object.entries(LANGUAGES).map(([key, value]) => ({
        label: (
          <Space>
            {value.label}
          </Space>
        ),
        value: key,
      }))}
      style={{ width: 150 }}
      suffixIcon={<GlobalOutlined />}
    />
  );
};
