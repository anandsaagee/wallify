import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
      <motion.div
        className="flex-1 flex items-center justify-center px-4 pt-6 pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-sm">
          {/* Image container with glow effect */}
          <div className="relative aspect-poster">
            {/* Gradient glow background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-premium blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Actual image */}
            <motion.img
              src={imageUrl}
              alt={imageAlt}
              className="w-full h-full object-cover rounded-premium shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Product info and selection - sticky container */}
      <motion.div
        className="bg-surface/95 backdrop-blur-md rounded-t-3xl shadow-2xl flex-shrink-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="px-6 py-8 sm:px-8">
          {/* Category label */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">
              {category}
            </p>
          </motion.div>

          {/* Product title */}
          <motion.h1
            className="text-2xl sm:text-3xl font-bold text-white mt-3 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
          >
            {title}
          </motion.h1>

          {/* Option selection */}
          <div className="mb-8">
            <motion.h2
              className="text-sm font-semibold text-muted uppercase tracking-wider mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Select Option
            </motion.h2>

            {/* Options grid */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
            >
              <AnimatePresence>
                {options.map((option, index) => (
                  <motion.button
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
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      delay: 0.35 + index * 0.05,
                      type: 'spring',
                      stiffness: 400,
                      damping: 40,
                    }}
                    disabled={isLoading}
                  >
                    <span>{option.label}</span>
                    <AnimatePresence>
                      {isOptionSelected(option.id) && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          transition={{
                            type: 'spring',
                            stiffness: 500,
                            damping: 40,
                          }}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
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
            <AnimatePresence>
              {!selectedOption && (
                <motion.p
                  className="text-xs text-muted text-center mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  Select an option to continue
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductDetail
