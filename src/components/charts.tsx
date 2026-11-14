import { StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import Svg, { Circle, Polyline } from 'react-native-svg';
import { formatDistance, formatWeight, type DistanceUnit, type WeightUnit } from '../format';
import { images } from '../images';
import { colors, font } from '../theme';

export function WalkRing({
  walkedKm,
  goalKm,
  unit,
}: {
  walkedKm: number;
  goalKm: number;
  unit: DistanceUnit;
}) {
  const size = 176;
  const stroke = 16;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = goalKm <= 0 ? 0 : Math.max(0, Math.min(1, walkedKm / goalKm));
  const walked = formatDistance(walkedKm, unit);
  const goal = formatDistance(goalKm, unit);
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.teal}
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.orange}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={`${circumference * progress} ${circumference}`}
          strokeDashoffset={circumference * 0.25}
          transform={`rotate(180 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <Image
        source={images.goal}
        style={styles.goalFace}
        contentFit="contain"
        accessibilityLabel="Biscuit cheering the walk goal"
      />
      <Text style={styles.goalLabel}>Walk Goal</Text>
      <Text style={styles.goalValue}>
        {walked.text} / {goal.text} {goal.unit}
      </Text>
    </View>
  );
}

export function WeightChart({
  points,
  unit,
}: {
  points: Array<{ id: string; label: string; lbs: number }>;
  unit: WeightUnit;
}) {
  const width = 300;
  const height = 132;
  if (points.length === 0) {
    return <Text style={styles.empty}>Log a weight and the chart will draw itself.</Text>;
  }
  const values = points.map((point) => (unit === 'kg' ? point.lbs * 0.453592 : point.lbs));
  const min = Math.min(...values) - 0.4;
  const max = Math.max(...values) + 0.4;
  const span = max - min || 1;
  const step = points.length === 1 ? 0 : (width - 36) / (points.length - 1);
  const coords = values.map((value, index) => {
    const x = 18 + step * index;
    const y = 16 + (1 - (value - min) / span) * (height - 36);
    return { x, y };
  });
  const line = coords.map((point) => `${point.x},${point.y}`).join(' ');
  return (
    <View>
      <View style={styles.band}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <Polyline points={line} fill="none" stroke={colors.teal} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
          {coords.map((point, index) => (
            <Circle key={points[index].id} cx={point.x} cy={point.y} r={6} fill={colors.orange} />
          ))}
        </Svg>
      </View>
      <View style={styles.labels}>
        {points.map((point) => {
          const shown = formatWeight(point.lbs, unit);
          return (
            <Text key={point.id} style={styles.label}>
              {point.label} {shown.text}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  goalFace: {
    width: 108,
    height: 56,
    marginTop: -6,
  },
  goalLabel: {
    fontFamily: font.extra,
    color: colors.teal,
    fontSize: 16,
    marginTop: 2,
  },
  goalValue: {
    fontFamily: font.extra,
    color: colors.teal,
    fontSize: 16,
  },
  band: {
    backgroundColor: colors.chart,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 6,
  },
  label: {
    flex: 1,
    textAlign: 'center',
    fontFamily: font.bold,
    color: colors.muted,
    fontSize: 12,
  },
  empty: {
    fontFamily: font.semibold,
    color: colors.muted,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 8,
  },
});
