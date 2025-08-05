export default function DetailSettings() {
  return (
    <div className="space-y-4">
      <div>
        <label className="theme-text-secondary mb-2 block text-sm font-medium">AI 모델</label>
        <select className="theme-border-secondary theme-bg-secondary theme-text-primary w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
          <option value="gpt-4">GPT-4</option>
        </select>
      </div>
      <div>
        <div className="theme-text-secondary mb-3">맞춤 설정</div>
        <form action="" className="flex flex-col gap-2">
          <label htmlFor="nickname" className="theme-text-secondary block text-sm font-medium">
            어떻게 불러드리면 좋을까요?
          </label>
          <input
            type="text"
            id="nickname"
            className="theme-border-secondary theme-bg-secondary theme-text-primary w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="닉네임을 적어주세요."
          />
          <label htmlFor="features" className="theme-text-secondary block text-sm font-medium">
            어떤 특성을 지녔으면 하나요?
          </label>
          <textarea
            id="features"
            className="theme-border-secondary theme-bg-secondary theme-text-primary w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="특성을 적어주세요."
          />
        </form>
      </div>
    </div>
  );
}
