import React, { useState } from 'react'

import { Check, Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface ProductOption {
  id: string | number
  label: string
  value: string
}

interface ProductDetailProps {
  /** Product title */
  title: string
  /** Category label (e.g., "Art & Design") */
  category: string
  /** Product image URL */
  imageUrl: string
  /** Image alt text */
  imageAlt?: string
  /** Available options for selection */
  options: ProductOption[]
  /** Callback when an option is selected */
  onSelect?: (option: ProductOption) => void
  /** Callback when Continue button is clicked */
  onContinue?: (option: ProductOption) => void
  /** Button text (default: "Continue") */
  buttonText?: string
  /** Show loading state in button */
  isLoading?: boolean
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  title,
  category,
  imageUrl,
  imageAlt = 'Product',
  options,
  onSelect,
  onContinue,
  buttonText = 'Continue',
  isLoading = false,
}) => {
  const [selectedOption, setSelectedOption] = useState<ProductOption | null>(null)

  const handleSelectOption = (option: ProductOption) => {
    setSelectedOption(option)
    onSelect?.(option)
  }

  const handleContinue = () => {
    if (selectedOption) {
      onContinue?.(selectedOption)
    }
  }

  const isOptionSelected = (optionId: string | number) => selectedOption?.id === optionId

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-hidden">
      {/* Top section with image */}
      <div
        className="flex-1 flex items-center justify-center px-4 pt-6 pb-8 transition-all duration-300"
      >
        <div className="w-full max-w-sm">
          {/* Image container with glow effect */}
          <div className="relative aspect-poster">
            {/* Gradient glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-premium blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Actual image */}
            <img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover rounded-premium shadow-2xl transition-all duration-300"
            />
          </div>
        </div>
      </motion.div>

      {/* Product info and selection - sticky container */}
      <div
        className="bg-surface/95 backdrop-blur-md rounded-t-3xl shadow-2xl flex-shrink-0 transition-all duration-300"
      >
        <div className="px-6 py-8 sm:px-8">
          {/* Category label */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {category}
            </p>
          </div>

          {/* Product title */}
          <h1
            className="text-2xl sm:text-3xl font-bold text-white mt-3 mb-8"
          >
            {title}
          </h1>

          {/* Option selection */}
          <div className="mb-8">
            <h2
              className="text-sm font-semibold text-muted uppercase tracking-wider mb-4"
            >
              Select Option
            </h2>

            {/* Options grid */}
            <div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              <>
                {options.map((option, index) => (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option)}
                    className={clsx(
                      'relative py-3 px-4 rounded-premium font-medium text-sm transition-all duration-200',
                      'flex items-center justify-center gap-2',
                      'border-2 border-border hover:border-primary/50',
                      isOptionSelected(option.id)
                        ? 'border-primary bg-primary/10 text-primary shadow-lg shadow-primary/20'
                        : 'bg-card text-white hover:bg-card/80 active:scale-95'
                    )}
                    disabled={isLoading}
                  >
                    <span>{option.label}</span>
                    <>
                      {isOptionSelected(option.id) && (
                        <div
                          className="transition-all duration-300"
                        >
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </>
                  </button>
                ))}
              </>
            </div>
          </div>

          {/* CTA Button */}
          <div>
            <button
              onClick={handleContinue}
              disabled={!selectedOption || isLoading}
              className={clsx(
                'w-full py-4 px-6 rounded-premium font-semibold text-base',
                'transition-all duration-200 flex items-center justify-center gap-2',
                'uppercase tracking-wide',
                selectedOption && !isLoading
                  ? 'bg-primary text-background hover:shadow-lg hover:shadow-primary/30 active:scale-95'
                  : 'bg-border text-muted cursor-not-allowed opacity-50'
              )}
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{buttonText}</span>
            </button>

            {/* Helper text */}
            <>
              {!selectedOption && (
                <p
                  className="text-xs text-muted text-center mt-3 transition-opacity duration-300"
                >
                  Select an option to continue
                </p>
              )}
            </>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
