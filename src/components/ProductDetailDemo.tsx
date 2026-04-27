import React, { useState } from 'react'
import ProductDetail from './ProductDetail'

const DEMO_PRODUCTS = {
  poster: {
    title: 'Premium Poster Collection',
    category: 'Art & Design',
    imageUrl:
      'https://images.unsplash.com/photo-1579783902614-e3fb5141b0cb?w=500&h=700&fit=crop',
    options: [
      { id: 'a6', label: 'A6', value: '105x148mm' },
      { id: 'a5', label: 'A5', value: '148x210mm' },
      { id: 'a4', label: 'A4', value: '210x297mm' },
      { id: 'a3', label: 'A3', value: '297x420mm' },
    ],
  },
  shirt: {
    title: 'Minimalist Cotton Tee',
    category: 'Apparel',
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=700&fit=crop',
    options: [
      { id: 'xs', label: 'XS', value: 'extra-small' },
      { id: 'sm', label: 'S', value: 'small' },
      { id: 'md', label: 'M', value: 'medium' },
      { id: 'lg', label: 'L', value: 'large' },
      { id: 'xl', label: 'XL', value: 'extra-large' },
      { id: 'xxl', label: '2XL', value: 'double-extra-large' },
    ],
  },
}

export const ProductDetailDemo: React.FC<{ product?: 'poster' | 'shirt' }> = ({
  product = 'poster',
}) => {
  const [selectedOption, setSelectedOption] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const productData = DEMO_PRODUCTS[product]

  const handleSelect = (option: any) => {
    setSelectedOption(option)
    console.log('Option selected:', option)
  }

  const handleContinue = async (option: any) => {
    setIsLoading(true)
    console.log('Continue clicked with:', option)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsLoading(false)
    alert(`Selected: ${option.label} (${option.value})`)
  }

  return (
    <ProductDetail
      title={productData.title}
      category={productData.category}
      imageUrl={productData.imageUrl}
      options={productData.options}
      onSelect={handleSelect}
      onContinue={handleContinue}
      isLoading={isLoading}
    />
  )
}

export default ProductDetailDemo
