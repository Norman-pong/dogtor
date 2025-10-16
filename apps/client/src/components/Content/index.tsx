import arrow from '../../assets/arrow.png'

const Content = () => {
  return (
    <view className='Content'>
      <image src={arrow} className='Arrow' />
      <text className='Description'>Tap the logo and have fun!</text>
      <text className='Hint'>
        Edit<text
          style={{
            fontStyle: 'italic',
            color: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          {' src/App.tsx '}
        </text>
        to see updates!
      </text>
    </view>
  )
}

export default Content