import { useState, useEffect } from 'react'
import { X, FolderOpen, Loader } from 'lucide-react'

const API_BASE = ''

export default function MediaPicker({ isOpen, onClose, onSelect }) {
  const [mediaList, setMediaList] = useState([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (isOpen) {
      setPage(0)
      fetchMedia(0)
    }
  }, [isOpen])

  const fetchMedia = async (pageNum = 0) => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/media?page=${pageNum}&size=24`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setMediaList(data.content || [])
      setTotalPages(data.totalPages || 0)
    } catch (err) {
      console.error('获取媒体列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (media) => {
    if (onSelect) {
      onSelect(`${API_BASE}/api/public/media/${media.id}`)
    }
    onClose?.()
  }

  const handlePrev = () => {
    const newPage = Math.max(0, page - 1)
    setPage(newPage)
    fetchMedia(newPage)
  }

  const handleNext = () => {
    const newPage = Math.min(totalPages - 1, page + 1)
    setPage(newPage)
    fetchMedia(newPage)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-5 h-5 text-purple-600" />
            从资源库选择
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader className="w-6 h-6 animate-spin text-purple-500" />
              <span className="ml-2 text-gray-500">加载中...</span>
            </div>
          ) : mediaList.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>资源库为空，先去上传图片吧</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {mediaList.map((media) => (
                <div
                  key={media.id}
                  onClick={() => handleSelect(media)}
                  className="group relative aspect-square bg-gray-50 rounded-xl overflow-hidden cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all"
                >
                  <img
                    src={`${API_BASE}/api/public/media/${media.id}`}
                    alt={media.filename}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/20 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium transition-opacity">
                      选择
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                    <p className="text-xs text-white truncate">{media.filename}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 p-4 border-t border-gray-100">
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一页
            </button>
            <span className="text-sm text-gray-500 px-4">
              第 {page + 1} / {totalPages} 页
            </span>
            <button
              onClick={handleNext}
              disabled={page >= totalPages - 1}
              className="px-4 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一页
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
