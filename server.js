import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// GET 요청 처리 추가 (테스트용)
app.get('/api/chat', (req, res) => {
  res.json({ message: '채팅 API가 정상적으로 작동 중입니다. POST 요청을 사용해주세요.' });
});

app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: '유효하지 않은 메시지 형식' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 1000,
    });

    const reply = completion.choices[0].message.content;

    console.log('server 요청 처리 완료!');
    res.json({ message: reply });
  } catch (e) {
    console.log('OpenAI API Error!', e);
    res.status(500).json({ error: 'Server Error', details: e.message });
  }
});

// server start
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
