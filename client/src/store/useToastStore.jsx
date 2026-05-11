import {create} from 'zustand'

export const useToastStore = create((set) => ({
  message: '',
  isToastVisible: false,
  setMessage: (incomingMessage) => {
    set({message: incomingMessage, isToastVisible: true})
    setTimeout(() => set({ message: '', isToastVisible: false }), 3000)
  }
}))
