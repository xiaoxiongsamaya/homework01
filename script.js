// ============================================
// AI 灵感生成器 - DeepSeek API 版
// 用户自己填写 API Key，不会泄露
// ============================================

const STUDENT_ID = '423240641';
const STUDENT_NAME = '林昊龙';

// DeepSeek API 地址
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// DOM 元素
const topicInput = document.getElementById('topic');
const generateBtn = document.getElementById('generateBtn');
const temperatureSlider = document.getElementById('temperature');
const tempValue = document.getElementById('tempValue');
const resultArea = document.getElementById('resultArea');
const ideaContent = document.getElementById('ideaContent');
const loadingDiv = document.getElementById('loading');
const apiKeyInput = document.getElementById('apiKey');

// 显示学号姓名到控制台
console.log(`学号：${STUDENT_ID}，姓名：${STUDENT_NAME}`);

// 温度参数实时显示
temperatureSlider.addEventListener('input', function() {
    tempValue.textContent = this.value;
});

// 保存 API Key 到 localStorage（可选：让用户不用每次都填）
apiKeyInput.addEventListener('blur', function() {
    if (apiKeyInput.value) {
        localStorage.setItem('deepseek_api_key', apiKeyInput.value);
    }
});

// 页面加载时，尝试从 localStorage 读取之前保存的 Key
window.addEventListener('load', function() {
    const savedKey = localStorage.getItem('deepseek_api_key');
    if (savedKey) {
        apiKeyInput.value = savedKey;
    }
});

// 生成创意的主函数
async function generateIdea() {
    const topic = topicInput.value.trim();
    if (!topic) {
        alert('请输入一个主题');
        return;
    }

    // 获取用户填写的 API Key
    const apiKey = apiKeyInput.value.trim();
    if (!apiKey) {
        alert('请先填写你的 DeepSeek API Key\n\n');
        return;
    }

    const temperature = parseFloat(temperatureSlider.value);
    
    // 显示加载状态
    loadingDiv.style.display = 'block';
    resultArea.style.display = 'none';
    generateBtn.disabled = true;
    generateBtn.textContent = '⏳ 生成中...';

    // 构建提示词
    const prompt = `请为一个关于"${topic}"的项目提供一个创新的、前沿的创意想法。
要求：
1. 创意要有前瞻性
2. 可以结合 AI、Web3、元宇宙、可持续发展等前沿技术
3. 回答控制在100字以内
4. 直接给出创意内容，不要说废话`;

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一个创意助手，回答要简洁、有创意、有前瞻性。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: temperature,
                max_tokens: 300,
                stream: false
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 401) {
                throw new Error('API Key 无效，请检查是否正确填写');
            } else if (response.status === 429) {
                throw new Error('请求太频繁，请稍后再试');
            } else {
                throw new Error(errorData.error?.message || `API 请求失败: ${response.status}`);
            }
        }

        const data = await response.json();
        const idea = data.choices[0].message.content;
        
        // 显示结果
        ideaContent.textContent = idea;
        resultArea.style.display = 'block';
        
    } catch (error) {
        console.error('调用失败:', error);
        ideaContent.textContent = `❌ 出错了：${error.message}\n\n💡 提示：请确保你的 DeepSeek API Key 正确有效，并且账户有余额。`;
        resultArea.style.display = 'block';
    } finally {
        loadingDiv.style.display = 'none';
        generateBtn.disabled = false;
        generateBtn.textContent = '🚀 生成创意';
    }
}

// 可选：按回车键触发生成
topicInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        generateIdea();
    }
});