/**
 * OCR文字识别工具类
 */

/**
 * 支持的语言列表
 */
export const SUPPORTED_LANGUAGES = [
  { code: 'zh', name: '中文' },
  { code: 'en', name: '英文' },
  { code: 'ja', name: '日文' },
  { code: 'ko', name: '韩文' },
  { code: 'pt', name: '葡萄牙语' },
  { code: 'fr', name: '法语' },
  { code: 'es', name: '西班牙语' },
  { code: 'de', name: '德语' },
  { code: 'it', name: '意大利语' },
  { code: 'ru', name: '俄语' }
  // 可以继续添加更多语言
]

/**
 * OCR识别配置
 */
export interface OCRConfig {
  language: string // 识别语言代码
  imagePath: string // 图片路径
}

/**
 * OCR识别结果
 */
export interface OCRResult {
  text: string // 识别的文字内容
  confidence?: number // 识别置信度
  words?: Array<{
    text: string
    bbox: { x: number; y: number; width: number; height: number }
  }> // 文字位置信息
}

/**
 * 执行OCR识别
 * @param config OCR配置
 * @returns 识别结果
 */
export const recognizeText = async (
  config: OCRConfig
): Promise<OCRResult> => {
  // TODO: 实际项目中需要调用OCR API
  // 可以使用以下服务：
  // 1. 百度OCR API
  // 2. 腾讯OCR API
  // 3. 阿里云OCR API
  // 4. 华为云OCR API
  // 5. 其他第三方OCR服务

  return new Promise((resolve) => {
    // 模拟API调用
    setTimeout(() => {
      resolve({
        text: '这是从图片中识别出的文字内容。\n\n在实际项目中，这里会调用OCR API来识别图片中的文字。',
        confidence: 0.95
      })
    }, 2000)
  })
}

/**
 * 搜索关键词在识别结果中的位置
 * @param text 文本内容
 * @param keyword 关键词
 * @returns 匹配位置数组
 */
export const searchKeyword = (
  text: string,
  keyword: string
): Array<{ start: number; end: number }> => {
  const matches: Array<{ start: number; end: number }> = []
  const regex = new RegExp(keyword, 'gi')
  let match

  while ((match = regex.exec(text)) !== null) {
    matches.push({
      start: match.index,
      end: match.index + match[0].length
    })
  }

  return matches
}

/**
 * 高亮文本中的关键词
 * @param text 文本内容
 * @param keyword 关键词
 * @returns 高亮后的HTML文本
 */
export const highlightKeyword = (
  text: string,
  keyword: string
): string => {
  if (!keyword) return text
  const regex = new RegExp(`(${keyword})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
