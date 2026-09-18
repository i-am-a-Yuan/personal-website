import { useState, useEffect, useRef } from 'react'
import { Upload, Trash2, Edit3, Image, Loader, X, Check, Download, FolderOpen } from 'lucide-react'

const API_BASE = ''

export default function MediaManager() {
  const [mediaList, setMediaList] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')
  const fileInputRef = useRef(null)

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchMedia()
  }, [page])

  const fetchMedia = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/media?page=${page}&size=20`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setMediaList(data.content || [])
      setTotalPages(data.totalPages || 0)
      setTotalElements(data.totalElements || 0)
    } catch (err) {
      console.error('获取媒体列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`${API_BASE}/api/admin/upload/image`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      const data = await res.json()
      if (res.ok) {
        // 上传成功后刷新列表，回到第一页
        setPage(0)
        fetchMedia()
      } else {
        alert(data.error || '上传失败')
      }
    } catch (err) {
      console.error('上传失败:', err)
      alert('上传失败，请重试')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (media) => {
    const confirmMsg = media.refCount > 0
      ? `该图片被 ${media.refCount} 处引用，确定删除吗？`
      : '确定删除这张图片吗？此操作不可撤销。'
    if (!confirm(confirmMsg)) return

    try {
      const res = await fetch(`${API_BASE}/api/admin/media/${media.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        fetchMedia()
      } else {
        alert('删除失败')
      }
    } catch (err) {
      console.error('删除失败:', err)
      alert('删除失败，请重试')
    }
  }

  const startRename = (media) => {
    setEditingId(media.id)
    setEditName(media.filename)
  }

  const saveRename = async (id) => {
    if (!editName.trim()) {
      alert('文件名不能为空')
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/admin/media/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ filename: editName.trim() })
      })
      if (res.ok) {
        setEditingId(null)
        fetchMedia()
      } else {
        alert('重命名失败')
      }
    } catch (err) {
      console.error('重命名失败:', err)
      alert('重命名失败，请重试')
    }
  }

  const cancelRename = () => {
    setEditingId(null)
    setEditName('')
  }

  const formatSize = (bytes) => {
    if (!bytes) return '-'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '-'
    return new Date(dateStr).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-7 h-7 text-purple-600" />
            资源管理
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            管理您上传的所有图片资源（共 {totalElements} 张）
          </p>
        </div>
        <label className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all cursor-pointer">
          <Upload className="w-4 h-4" />
          {uploading ? '上传中...' : '上传图片'}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-6 h-6 animate-spin text-purple-500" />
          <span className="ml-2 text-gray-500">加载中...</span>
        </div>
      ) : mediaList.length === 0 ? (
        <div className="text-center py-20 text-gray-500 bg-white rounded-xl border border-gray-100">
          <Image className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-lg mb-2">还没有上传任何图片</p>
          <p className="text-sm text-gray-400">点击右上角"上传图片"按钮开始上传</p>
        </div>
      ) : (
        <>
          {/* 图片网格 */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {mediaList.map((media) => (
              <div
                key={media.id}
                className="group relative bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                {/* 图片预览 */}
                <div className="aspect-square bg-gray-50 overflow-hidden">
                  <img
                    src={`${API_BASE}/api/public/media/${media.id}`}
                    alt={media.filename}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.opacity = '0.3' }}
                  />
                </div>

                {/* Hover 操作按钮 */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => startRename(media)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-gray-600 hover:text-purple-600 transition-colors shadow"
                    title="重命名"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <a
                    href={`${API_BASE}/api/public/media/${media.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={media.filename}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-gray-600 hover:text-blue-600 transition-colors shadow"
                    title="下载"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDelete(media)}
                    className="p-1.5 bg-white/90 backdrop-blur-sm rounded-lg hover:bg-white text-gray-600 hover:text-red-600 transition-colors shadow"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* 引用计数标记 */}
                {media.refCount > 0 && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-500/90 text-white text-xs rounded-full font-medium">
                    引用 {media.refCount}
                  </div>
                )}

                {/* 文件名 */}
                <div className="p-3 border-t border-gray-50">
                  {editingId === media.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(media.id)
                          if (e.key === 'Escape') cancelRename()
                        }}
                        className="flex-1 px-2 py-1 text-sm border border-purple-300 rounded focus:outline-none focus:ring-1 focus:ring-purple-500"
                        autoFocus
                      />
                      <button
                        onClick={() => saveRename(media.id)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="保存"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={cancelRename}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded"
                        title="取消"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <p
                      className="text-sm font-medium text-gray-800 truncate cursor-pointer hover:text-purple-600"
                      onClick={() => startRename(media)}
                      title="点击重命名"
                    >
                      {media.filename}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-1.5 text-xs text-gray-400">
                    <span>{formatSize(media.fileSize)}</span>
                    <span>{new Date(media.createdAt).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>
              <span className="text-sm text-gray-500 px-4">
                第 {page + 1} / {totalPages} 页
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
