interface NotFoundPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

export default function NotFoundPage({ error }: NotFoundPageProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="mx-auto max-w-md px-4 text-center">
        <div className="mb-6">
          <div className="mb-4 text-6xl font-bold text-gray-300">404</div>
          <h2 className="mb-2 text-2xl font-semibold text-gray-800">페이지를 찾을 수 없습니다</h2>
          <p className="mb-6 text-gray-600">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => (window.location.href = '/')}
            className="w-full rounded-lg bg-blue-500 px-6 py-3 text-white transition-colors hover:bg-blue-600"
          >
            홈으로 돌아가기
          </button>

          <button
            onClick={() => window.history.back()}
            className="w-full rounded-lg border border-gray-300 px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50"
          >
            이전 페이지로
          </button>
        </div>

        {error && process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              개발자 정보 (클릭하여 확장)
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-gray-100 p-3 text-xs text-gray-700">
              {error.message}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
