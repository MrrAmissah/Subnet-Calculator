interface Props {
  message: string
}

export default function ValidationMessage({ message }: Props) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-fail">
      <svg width="11" height="11" viewBox="0 0 12 12" fill="currentColor" className="shrink-0">
        <path d="M6 1a5 5 0 100 10A5 5 0 006 1zm-.5 2.75a.5.5 0 011 0v2.75a.5.5 0 01-1 0V3.75zm.5 5a.625.625 0 110-1.25.625.625 0 010 1.25z" />
      </svg>
      {message}
    </p>
  )
}
