// ./_components/TranslateHandler.js
import axios from 'axios';
import { useState } from 'react';

export function useTranslateHandler() {
  const [translatedTexts, setTranslatedTexts] = useState({});
  const [showTranslations, setShowTranslations] = useState({});

  const handleTranslate = async (content, direction, timestamp) => {
    if (showTranslations[timestamp]) {
      // 如果已显示翻译，则隐藏
      setShowTranslations((prev) => ({
        ...prev,
        [timestamp]: false,
      }));
      return;
    }

    // 如果未显示翻译，则翻译并显示
    if (!translatedTexts[timestamp]) {
      try {
        const response = await axios.post('http://127.0.0.1:18080/translate', {
          text: content,
          direction: direction,
        });
        setTranslatedTexts((prev) => ({
          ...prev,
          [timestamp]: response.data.translated_text,
        }));
      } catch (error) {
        console.error('Translation error:', error);
        return;
      }
    }

    setShowTranslations((prev) => ({
      ...prev,
      [timestamp]: true,
    }));
  };

  return {
    translatedTexts,
    showTranslations,
    handleTranslate,
  };
}
