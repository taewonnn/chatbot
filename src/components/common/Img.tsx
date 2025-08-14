interface IImg {
  src: string;
  alt?: string;
  className?: string;
  width?: string;
  height?: string;
  loading?: 'lazy' | 'eager';
  style?: React.CSSProperties;
}

export default function Img({
  src,
  alt = 'Image',
  className,
  width,
  height,
  loading = 'lazy',
  style,
}: IImg) {
  const isExternal = src.startsWith('http://') || src.startsWith('https://'); // 외부 경로 확인

  const imgSrc = isExternal ? src : new URL(`/src/assets/${src}`, import.meta.url).href;

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`${className}`}
      width={width}
      height={height}
      loading={loading}
      style={style}
    />
  );
}
