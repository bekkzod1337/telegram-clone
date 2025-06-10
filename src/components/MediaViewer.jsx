import { Dialog, DialogContent } from '@mui/material'

export default function MediaViewer({ open, onClose, src, type, alt = 'media content' }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      aria-labelledby="media-viewer-title"
    >
      <DialogContent>
        {type === 'image' ? (
          <img
            src={src}
            alt={alt}
            loading="lazy"
            style={{ width: '100%', borderRadius: 8, objectFit: 'contain' }}
            onError={(e) => {
              e.currentTarget.src = '/fallback-image.png' // fallback rasm URL
            }}
          />
        ) : (
          <video
            controls
            preload="metadata"
            style={{ width: '100%', borderRadius: 8 }}
            aria-label={alt}
          >
            <source src={src} type="video/mp4" />
            Video qo‘llab-quvvatlanmaydi.
          </video>
        )}
      </DialogContent>
    </Dialog>
  )
}
