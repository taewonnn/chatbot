interface NotFoundPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export default function NotFoundPage({ error }: NotFoundPageProps) {
  return (
    <div className="theme-bg-secondary flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mb-6">
          <div className="theme-text-tertiary mb-4 text-6xl font-bold">404</div>
          <h2 className="theme-text-primary mb-2 text-2xl font-semibold">
            페이지를 찾을 수 없습니다
          </h2>
          <p className="theme-text-secondary mb-6">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => (window.location.href = '/')}
            className="theme-accent theme-accent-hover w-full rounded-lg px-6 py-3 text-white transition-colors"
          >
            홈으로 돌아가기
          </button>

          <button
            onClick={() => window.history.back()}
            className="theme-border-secondary theme-bg-secondary theme-text-secondary hover:theme-bg-tertiary w-full rounded-lg border px-6 py-3 transition-colors"
          >
            이전 페이지로
          </button>
        </div>

        {error && process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="theme-text-tertiary hover:theme-text-secondary cursor-pointer text-sm">
              개발자 정보 (클릭하여 확장)
            </summary>
            <pre className="theme-bg-tertiary theme-text-secondary mt-2 overflow-auto rounded p-3 text-xs">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
