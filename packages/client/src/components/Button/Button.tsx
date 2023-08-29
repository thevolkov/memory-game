import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import cn from '@/utils/classNames'
import s from './Button.module.scss'

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  theme?: 'blue'
  className?: string
  children: ReactNode
}

const Button = ({ theme, className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(s.button, { [s.buttonPrimary]: theme === 'blue' }, [
        className,
      ])}
      {...props}>
      {children}
    </button>
  )
}

export default Button