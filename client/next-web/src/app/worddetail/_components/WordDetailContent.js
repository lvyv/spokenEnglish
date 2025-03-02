"use client";
import "./style.css"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
export default function WordDetailContent() {
  const { word } = useParams();
  const [wordInfo, setWordInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translations, setTranslations] = useState({}); // Store translations here
  useEffect(() => {
    const fetchTranslations = async () => {
      if (!wordInfo || !wordInfo.definition) return;

      const definitionList = wordInfo.definition.split("\n");
      const translationsObj = {};

      for (const def of definitionList) {
        try {
          const requestPayload = { 
            text: def,
            direction: "en-zh"  // 更新字段名  
          };
         
          console.log("Request Payload:", requestPayload);
          const response = await fetch("http://127.0.0.1:18080/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestPayload),
          });

          if (response.ok) {
            const result = await response.json();
            translationsObj[def] = result.translated_text; // Store the translation
          } else {
            console.error(`Failed to fetch translation for: "${def}". Status: ${response.status}`);
            translationsObj[def] = "翻译失败"; // If translation fails
          }
        } catch (err) {
          console.error("Translation request failed:", err);
          translationsObj[def] = "翻译失败"; // In case of network error
        }
      }

      setTranslations(translationsObj); // Update translations state
    };

    fetchTranslations();
  }, [wordInfo]); 

  // 翻译字段处理函数
  const parseTranslation = (translation) => {
    if (!translation) return "暂无翻译";

    const result = {}; // 存储按词性分类的翻译

    translation.split("\n").forEach((entry) => {
      const [pos, ...meanings] = entry.split(" "); // 提取词性和含义部分
      const meaning = meanings.join(" "); // 合并含义部分
      if (result[pos]) {
        result[pos].push(meaning); // 如果已有该词性，追加翻译
      } else {
        result[pos] = [meaning]; // 如果是新词性，创建数组
      }
    });

    // 渲染结果
    return Object.entries(result).map(([pos, meanings], index) => (
      <p key={index} className="mb-2 text-left">
        <strong>{pos}  </strong> {meanings.join("，")}
      </p>
    ));
  };

  // 解析 exchange 字段并每行显示三个变形
  const parseExchange = (exchange) => {
    if (!exchange) return "暂无变形信息";

    const mapping = {
      p: "过去式",
      i: "现在分词",
      "3": "第三人称单数",
      r: "形容词比较级",
      t: "形容词最高级",
      s: "名词复数形式",
      d: "过去分词",
    };

    const items = exchange.split("/").map((entry) => {
      const [key, value] = entry.split(":");
      const label = mapping[key] || key; // 映射中文含义
      return (
        <span key={key} className="flex-shrink-0 px-4 py-2 text-gray-500">
          <strong>{label}</strong>: {value}
        </span>
      );
    });

    // 按每行三个分组
    const groupedItems = [];
    for (let i = 0; i < items.length; i += 3) {
      groupedItems.push(
        <div key={i} className="flex justify-center space-x-6 mb-4">
          {items.slice(i, i + 3)}
        </div>
      );
    }

    return groupedItems;
  };

  // 解析 tag 字段并替换为对应中文和大写
  const parseTag = (tag) => {
    if (!tag) return "暂无标签";

    const tagMapping = {
      zk: "中考",
      gk: "高考",
      cet4: "CET4",
      cet6: "CET6",
      ky: "KY",
      ielts: "IELTS",
      toefl: "TOEFL",
      gre: "GRE",
      cet10: "CET10",
      cet11: "CET11",
    };

    const tags = tag.split(" ").map((item) => tagMapping[item] || item);
    return tags.join(" / ");
  };

  // 解析 definition 字段并显示每个定义
  const parseDefinition = (definition) => {
    if (!definition) return "暂无定义";

    const definitions = definition.split("\n").map((def, index) => {
      const trimmedDef = def.trim();
      return (
        <p key={index} className="mb-2 text-left text-blue-500">
          <span>{index + 1}. </span>{trimmedDef}
        </p>
      );
    });

    return (
      <div className="mt-4 flex justify-center">
        <div className="text-left">
          <h3 className="font-bold text-gray-800">英文定义</h3>
          {definitions}
        </div>
      </div>
    );
  };

  // 请求单词详细信息
  useEffect(() => {
    const fetchWordDetails = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:18080/api/word/${word}`);
        if (!response.ok) throw new Error("获取单词详细信息失败");
        const data = await response.json();
        setWordInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (word) fetchWordDetails();
  }, [word]);

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg max-w-3xl overflow-y-auto max-h-[70vh] text-center">
      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : wordInfo ? (
        <div>
          <div className="flex items-center justify-center mb-2">
            <h2 className="text-3xl font-bold text-gray-800">{wordInfo.word}</h2>
          </div>

          <div className="mb-4">
            <div className="inline-block rounded-full custom-style">
              <span>英</span>
              {wordInfo.phonetic ? `/${wordInfo.phonetic}/` : "[暂无音标]"}
            </div>
          </div>

          {/* 翻译 */}
          <div className="text-lg text-gray-700 mb-6">
            <div className="mt-2 text-left inline-block">
              {parseTranslation(wordInfo.translation)}
            </div>
          </div>


          <div className="text-lg text-gray-600 mb-4">
            <strong className="text-gray-800"></strong>
            <span className="text-[#939599] text-[20px] leading-[19px]">
              {parseTag(wordInfo.tag)}
            </span>
          </div>



          {/* 其他字段显示 */}
          <div className="text-gray-600">
            <p>
              <strong>词性：</strong> {wordInfo.pos || "暂无词性"}
            </p>
            <p>
              <strong>Collins 星级：</strong> {wordInfo.collins || "0"}
            </p>
            <p>
              <strong>牛津标签：</strong> {wordInfo.oxford || "0"}
            </p>
            <p>
              <strong>词频：</strong> BNC: {wordInfo.bnc || "0"}, FRQ: {wordInfo.frq || "0"}
            </p>
          </div>

          {/* 变形 */}
          <div className="text-lg text-gray-700 mt-6">
            <h3 className="font-bold text-gray-800 mb-4"></h3>
            {parseExchange(wordInfo.exchange)}
          </div>


          <div className="text-lg text-gray-700 mt-6">
            <h3 className="font-bold text-gray-800 mb-4"></h3>
            <div className="max-w-3xl mx-auto ml-80">  {/* This ensures the module is centered on the page */}
              {wordInfo.definition.split("\n").map((def, index) => (
                <div key={index} className="mb-4 text-left"> {/* Align text left here */}
                  <p className="text-blue-500">
                    <span>{index + 1}. </span>{def}
                  </p>
                  <p className="text-black">
                    {translations[def] || "翻译中..."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">未找到单词详细信息。</p>
      )}
    </div>
  );
}






