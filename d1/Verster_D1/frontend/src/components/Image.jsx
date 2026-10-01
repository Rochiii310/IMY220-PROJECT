export default function Image({ src, alt }) {
  return (
    <div className="image-frame">
      <img src={src} alt={alt} />
    </div>
  )
}
