import { useState, useEffect } from 'react'
import { KeyRound, User as UserIcon, Save, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react'

const API_BASE = ''

export default function AccountSettings() {
  const [username, setUsername] = useState('')

  // 修改用户名
  const [newUsername, setNewUsername] = useState('')
  const [usernamePassword, setUsernamePassword] = useState('')
  const [showUsernamePassword, setShowUsernamePassword] = useState(false)
  const [usernameMsg, setUsernameMsg] = useState(null) // { type: 'success'|'error', text: '' }
  const [usernameLoading, setUsernameLoading] = useState(false)

  // 修改密码
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState(null)
  const [passwordLoading, setPasswordLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('username')
    if (saved) setUsername(saved)
  }, [])

  const token = localStorage.getItem('token')

  // 修改用户名
  const handleChangeUsername = async (e) => {
    e.preventDefault()
    setUsernameMsg(null)

    if (!newUsername.trim()) {
      setUsernameMsg({ type: 'error', text: '请输入新用户名' })
      return
    }
    if (!usernamePassword) {
      setUsernameMsg({ type: 'error', text: '请输入当前密码' })
      return
    }

    setUsernameLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/username`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ newUsername: newUsername.trim(), password: usernamePassword }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        // 更新本地存储的用户名和 token
        localStorage.setItem('username', data.username)
        localStorage.setItem('token', data.token)
        setUsername(data.username)
        setNewUsername('')
        setUsernamePassword('')
        setUsernameMsg({ type: 'success', text: data.message || '用户名修改成功' })
      } else {
        setUsernameMsg({ type: 'error', text: data.message || '修改失败' })
      }
    } catch (err) {
      setUsernameMsg({ type: 'error', text: '网络错误，请稍后重试' })
    } finally {
      setUsernameLoading(false)
    }
  }

  // 修改密码
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setPasswordMsg(null)

    if (!oldPassword) {
      setPasswordMsg({ type: 'error', text: '请输入旧密码' })
      return
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: 'error', text: '新密码长度不能少于6位' })
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: '两次输入的新密码不一致' })
      return
    }

    setPasswordLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setOldPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setPasswordMsg({ type: 'success', text: data.message || '密码修改成功' })
      } else {
        setPasswordMsg({ type: 'error', text: data.message || '修改失败' })
      }
    } catch (err) {
      setPasswordMsg({ type: 'error', text: '网络错误，请稍后重试' })
    } finally {
      setPasswordLoading(false)
    }
  }

  const PasswordInput = ({ value, onChange, placeholder, show, onToggleShow, id }) => (
    <div className="relative">
      <input
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 text-gray-800 transition-all"
        style={{ '--tw-ring-color': 'var(--theme-primary)' }}
      />
      <button
        type="button"
        onClick={onToggleShow}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  )

  const Message = ({ msg }) => {
    if (!msg) return null
    const isSuccess = msg.type === 'success'
    return (
      <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm ${
        isSuccess ? 'bg-green-50 text-green-700 border border-green-100'
                  : 'bg-red-50 text-red-700 border border-red-100'
      }`}>
        {isSuccess ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
        <span>{msg.text}</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">账户设置</h2>
        <p className="text-gray-500 mt-1">管理你的登录账户与密码</p>
      </div>

      {/* 修改用户名 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--theme-gradient)' }}
          >
            <UserIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">修改用户名</h3>
            <p className="text-sm text-gray-500">修改后需要使用新用户名重新登录</p>
          </div>
        </div>

        <form onSubmit={handleChangeUsername} className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">当前用户名</label>
            <div className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-600">
              {username || '加载中...'}
            </div>
          </div>

          <div>
            <label htmlFor="new-username" className="block text-sm font-medium text-gray-700 mb-1.5">
              新用户名
            </label>
            <input
              id="new-username"
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="请输入新用户名"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-opacity-50 text-gray-800 transition-all"
            />
          </div>

          <div>
            <label htmlFor="username-password" className="block text-sm font-medium text-gray-700 mb-1.5">
              当前密码
            </label>
            <PasswordInput
              id="username-password"
              value={usernamePassword}
              onChange={setUsernamePassword}
              placeholder="请输入当前密码以确认身份"
              show={showUsernamePassword}
              onToggleShow={() => setShowUsernamePassword(!showUsernamePassword)}
            />
          </div>

          <Message msg={usernameMsg} />

          <button
            type="submit"
            disabled={usernameLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-white font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--theme-gradient)' }}
          >
            <Save className="w-4 h-4" />
            {usernameLoading ? '保存中...' : '保存修改'}
          </button>
        </form>
      </div>

      {/* 修改密码 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--theme-gradient)' }}
          >
            <KeyRound className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">修改密码</h3>
            <p className="text-sm text-gray-500">定期更换密码以保障账户安全</p>
          </div>
        </div>

        <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
          <div>
            <label htmlFor="old-password" className="block text-sm font-medium text-gray-700 mb-1.5">
              旧密码
            </label>
            <PasswordInput
              id="old-password"
              value={oldPassword}
              onChange={setOldPassword}
              placeholder="请输入当前密码"
              show={showOldPassword}
              onToggleShow={() => setShowOldPassword(!showOldPassword)}
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1.5">
              新密码
            </label>
            <PasswordInput
              id="new-password"
              value={newPassword}
              onChange={setNewPassword}
              placeholder="至少6位字符"
              show={showNewPassword}
              onToggleShow={() => setShowNewPassword(!showNewPassword)}
            />
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
              确认新密码
            </label>
            <PasswordInput
              id="confirm-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="再次输入新密码"
              show={showConfirmPassword}
              onToggleShow={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </div>

          <Message msg={passwordMsg} />

          <button
            type="submit"
            disabled={passwordLoading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 text-white font-medium rounded-xl transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'var(--theme-gradient)' }}
          >
            <Save className="w-4 h-4" />
            {passwordLoading ? '保存中...' : '修改密码'}
          </button>
        </form>
      </div>
    </div>
  )
}
