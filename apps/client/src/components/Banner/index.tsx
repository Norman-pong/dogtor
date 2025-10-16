import { useCallback, useState } from '@lynx-js/react'
import lynxLogo from '../../assets/lynx-logo.png'
import reactLynxLogo from '../../assets/react-logo.png'

const Banner = () => {
  const [alterLogo, setAlterLogo] = useState(false)
  const onTap = useCallback(() => {
    'background only'
    setAlterLogo(prev => !prev)
  }, [])

  return (
    <view className='Banner'>
      <view className='Logo' bindtap={onTap}>
        {alterLogo
          ? <image src={reactLynxLogo} className='Logo--react' />
          : <image src={lynxLogo} className='Logo--lynx' />}
      </view>
      <text className='Title'>React</text>
      <text className='Subtitle'>on Lynx</text>
    </view>
  )
}

export default Banner