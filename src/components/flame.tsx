import Svg, { Path } from 'react-native-svg';

export function Flame({ size = 36 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 23c-4.2 0-7.2-2.8-7.2-7 0-2.8 1.6-4.8 3-6.6.4 1.8 1.4 2.8 2.6 2.8-.5-2.6.1-5.2 1.6-8.6 2.6 2.4 5.8 5.4 5.8 9.8 0 5-3 9.6-5.8 9.6z"
        fill="#FFFFFF"
      />
    </Svg>
  );
}
