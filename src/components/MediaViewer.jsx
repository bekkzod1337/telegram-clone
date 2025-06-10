// components/MediaViewer.jsx
import { Dialog, DialogContent } from '@mui/material';

export default function MediaViewer({ open, onClose, src, type, alt = 'media content' }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogContent>
        {type === 'image' ? (
          <img 
            src={src} 
            alt={alt} 
            style={{ width: '100%', borderRadius: 8 }} 
            loading="lazy" 
          />
        ) : (
          <video 
            controls 
            style={{ width: '100%' }} 
            preload="metadata"
          >
            <source src={src} type="video/mp4" />
            Video qo‘llab-quvvatlanmaydi.
          </video>
        )}
      </DialogContent>
    </Dialog>
  );
}
