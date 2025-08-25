import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../api/products';
import Card from './ui/Card';

interface ProductCardProps {
  product: Product;
  onPress?: () => void;
}

export default function ProductCard({ product, onPress }: ProductCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Yeni':
        return { backgroundColor: '#DCFCE7', color: '#166534' };
      case 'Az Kullanılmış':
        return { backgroundColor: '#FEF3C7', color: '#92400E' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const conditionStyle = getConditionColor(product.condition);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
      <Card variant="elevated" padding="none" style={styles.card}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
          <View style={[styles.conditionBadge, { backgroundColor: conditionStyle.backgroundColor }]}>
            <Text style={[styles.conditionText, { color: conditionStyle.color }]}>
              {product.condition}
            </Text>
          </View>
        </View>
        
        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.brandText}>{product.brand}</Text>
          <Text style={styles.modelText} numberOfLines={1}>
            {product.model}
          </Text>
          
          {/* Price */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>
              {product.price.toLocaleString('tr-TR')} TL
            </Text>
            <Text style={styles.kdvText}>+ KDV</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  conditionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  conditionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  productInfo: {
    padding: 16,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  modelText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  priceText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
  },
  kdvText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
