// Icon.jsx
import {AiOutlineFile} from 'react-icons/ai'
import { FILE_ICON_MAP } from '../../Utils/iconMappings'
export function FileIcon({ name }) {
  function getExtensionName(fileName) {
    const ext = fileName?.split('.').pop().toLowerCase()
    return ext
  }

  const ext = getExtensionName(name)
  const iconConfig = FILE_ICON_MAP[ext]

  if (!iconConfig) return <AiOutlineFile />

  const { component: Icon, color } = iconConfig
  return <Icon color={color} />
}
