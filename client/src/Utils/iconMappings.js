// Icon.js - no JSX here at all
import {
  AiOutlineFileText,
  AiOutlineFileImage,
} from 'react-icons/ai'
import { BsFiletypeJson, BsFiletypeMd } from 'react-icons/bs'
import { DiJavascript1, DiCss3, DiHtml5, DiReact } from 'react-icons/di'

export const FILE_ICON_MAP = {
  js: { component: DiJavascript1, color: '#f7df1e' },
  jsx: { component: DiReact, color: '#61dafb' },
  ts: { component: DiJavascript1, color: '#3178c6' },
  tsx: { component: DiReact, color: '#3178c6' },
  css: { component: DiCss3, color: '#264de4' },
  html: { component: DiHtml5, color: '#e34c26' },
  json: { component: BsFiletypeJson, color: '#cbcb41' },
  md: { component: BsFiletypeMd, color: '#519aba' },
  png: { component: AiOutlineFileImage, color: '#a074c4' },
  jpg: { component: AiOutlineFileImage, color: '#a074c4' },
  svg: { component: AiOutlineFileImage, color: '#a074c4' },
  txt: { component: AiOutlineFileText, color: null },
}
