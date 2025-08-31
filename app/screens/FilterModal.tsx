import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "./Feed.styles";
import Button from "../components/ui/Button";

interface Condition {
  id: string;
  label: string;
  value: string;
}

interface Location {
  id: string;
  name: string;
}

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  query: string;
  setQuery: (query: string) => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  selectedBrands: string[];
  toggleBrand: (brand: string) => void;
  selectedConditions: string[];
  toggleCondition: (condition: string) => void;
  selectedLocation: string;
  setSelectedLocation: (location: string) => void;
  resetFilters: () => void;
  conditions: Condition[];
  locations: Location[];
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  query,
  setQuery,
  priceRange,
  setPriceRange,
  selectedBrands,
  toggleBrand,
  selectedConditions,
  toggleCondition,
  selectedLocation,
  setSelectedLocation,
  resetFilters,
  conditions,
  locations,
}) => {
  const [modalSearchQuery, setModalSearchQuery] = useState(query);
  const [tempPriceRange, setTempPriceRange] = useState(priceRange);
  const [modalMinPrice, setModalMinPrice] = useState(priceRange[0].toString());
  const [modalMaxPrice, setModalMaxPrice] = useState(priceRange[1].toString());
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

  useEffect(() => {
    setModalSearchQuery(query);
    setTempPriceRange(priceRange);
    setModalMinPrice(priceRange[0].toString());
    setModalMaxPrice(priceRange[1].toString());
  }, [priceRange, query, visible]);

  const applyFilters = (): void => {
    setPriceRange(tempPriceRange);
    setQuery(modalSearchQuery);
    onClose();
  };

  const handleReset = (): void => {
    resetFilters();
    setModalSearchQuery("");
    setTempPriceRange([0, 150000]);
    setModalMinPrice("0");
    setModalMaxPrice("150000");
    setShowLocationDropdown(false);
  };

  const handleMinPriceChange = (text: string): void => {
    setModalMinPrice(text);
    const min = Math.max(0, Math.min(parseInt(text) || 0, 150000));
    if (min > tempPriceRange[1]) {
      setTempPriceRange([min, 150000]);
    } else {
      setTempPriceRange([min, tempPriceRange[1]]);
    }
  };

  const handleMaxPriceChange = (text: string): void => {
    setModalMaxPrice(text);
    const max = Math.max(
      tempPriceRange[0],
      Math.min(parseInt(text) || 150000, 150000)
    );
    setTempPriceRange([tempPriceRange[0], max]);
  };

  const handleSliderMove = (event: any, containerWidth: number = 300): void => {
    const containerX = event.nativeEvent.locationX;
    const percentage = (containerX / containerWidth) * 100;
    const value = (percentage / 100) * 150000;

    const minDistance = Math.abs(value - tempPriceRange[0]);
    const maxDistance = Math.abs(value - tempPriceRange[1]);

    if (minDistance < maxDistance) {
      const newMin = Math.min(Math.max(0, value), tempPriceRange[1] - 10000);
      setTempPriceRange([newMin, tempPriceRange[1]]);
      setModalMinPrice(Math.round(newMin).toString());
    } else {
      const newMax = Math.max(
        Math.min(150000, value),
        tempPriceRange[0] + 10000
      );
      setTempPriceRange([tempPriceRange[0], newMax]);
      setModalMaxPrice(Math.round(newMax).toString());
    }
  };

  const selectLocation = (location: string): void => {
    setSelectedLocation(location);
    setShowLocationDropdown(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScrollView}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Brands</Text>

              <View style={styles.modalSearchInputContainer}>
                <Ionicons
                  name="search"
                  size={20}
                  color="#6B7280"
                  style={styles.searchIcon}
                />
                <TextInput
                  placeholder="Search brands"
                  placeholderTextColor="#6B7280"
                  value={modalSearchQuery}
                  onChangeText={setModalSearchQuery}
                  style={styles.modalSearchInput}
                  clearButtonMode="while-editing"
                />
              </View>

              <View style={styles.brandContainer}>
                {[
                  "Rolex",
                  "Patek Philippe",
                  "Audemars Piguet",
                  "Omega",
                  "A. Lange & Söhne",
                  "Vacheron Constantin",
                  "Grand Seiko",
                ].map((brand) => (
                  <TouchableOpacity
                    key={brand}
                    style={[
                      styles.brandButton,
                      selectedBrands.includes(brand) &&
                        styles.brandButtonSelected,
                    ]}
                    onPress={() => toggleBrand(brand)}
                  >
                    <Text
                      style={[
                        styles.brandButtonText,
                        selectedBrands.includes(brand) &&
                          styles.brandButtonTextSelected,
                      ]}
                    >
                      {brand}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Price Range</Text>

              <View style={styles.sliderContainer}>
                <Text style={styles.sliderLabel}>
                  {tempPriceRange[0].toLocaleString()} -{" "}
                  {tempPriceRange[1].toLocaleString()} TL
                </Text>

                <View style={styles.modernSliderContainer}>
                  <View style={styles.modernSliderTrack}>
                    <View
                      style={[
                        styles.modernSliderProgress,
                        {
                          left: `${(tempPriceRange[0] / 150000) * 100}%`,
                          width: `${
                            ((tempPriceRange[1] - tempPriceRange[0]) / 150000) *
                            100
                          }%`,
                        },
                      ]}
                    />
                  </View>

                  <View
                    style={[
                      styles.modernSliderThumb,
                      { left: `${(tempPriceRange[0] / 150000) * 100}%` },
                    ]}
                  >
                    <View style={styles.modernSliderThumbInner} />
                  </View>

                  <View
                    style={[
                      styles.modernSliderThumb,
                      { left: `${(tempPriceRange[1] / 150000) * 100}%` },
                    ]}
                  >
                    <View style={styles.modernSliderThumbInner} />
                  </View>

                  <View
                    style={styles.sliderTouchableArea}
                    onStartShouldSetResponder={() => true}
                    onResponderMove={(event) => handleSliderMove(event)}
                  />
                </View>
              </View>

              <View style={styles.priceInputsContainer}>
                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceInputLabel}>Min</Text>
                  <View style={styles.modernPriceInput}>
                    <Text style={styles.currencySymbol}>₺</Text>
                    <TextInput
                      value={modalMinPrice}
                      onChangeText={handleMinPriceChange}
                      keyboardType="numeric"
                      style={styles.modernPriceInputText}
                      placeholder="0"
                      placeholderTextColor="#6B7280"
                      maxLength={6}
                    />
                  </View>
                </View>

                <View style={styles.priceInputDivider}>
                  <Text style={styles.priceDividerText}>-</Text>
                </View>

                <View style={styles.priceInputWrapper}>
                  <Text style={styles.priceInputLabel}>Max</Text>
                  <View style={styles.modernPriceInput}>
                    <Text style={styles.currencySymbol}>₺</Text>
                    <TextInput
                      value={modalMaxPrice}
                      onChangeText={handleMaxPriceChange}
                      keyboardType="numeric"
                      style={styles.modernPriceInputText}
                      placeholder="150000"
                      placeholderTextColor="#6B7280"
                      maxLength={6}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Condition Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Condition</Text>
              <View style={styles.conditionChipsRow}>
                {["New", "Excellent", "Very Good", "Good"].map((condition) => (
                  <TouchableOpacity
                    key={condition}
                    style={[
                      styles.conditionChip,
                      selectedConditions.includes(condition.toLowerCase()) &&
                        styles.conditionChipSelected,
                    ]}
                    onPress={() => toggleCondition(condition.toLowerCase())}
                  >
                    <Text
                      style={[
                        styles.conditionChipText,
                        selectedConditions.includes(condition.toLowerCase()) &&
                          styles.conditionChipTextSelected,
                      ]}
                    >
                      {condition}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Location Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Location</Text>

              <TouchableOpacity
                style={styles.locationDropdown}
                onPress={() => setShowLocationDropdown(!showLocationDropdown)}
              >
                <Text style={styles.locationDropdownText}>
                  {selectedLocation}
                </Text>
                <Ionicons
                  name={showLocationDropdown ? "chevron-up" : "chevron-down"}
                  size={20}
                  color="#6B7280"
                />
              </TouchableOpacity>

              {showLocationDropdown && (
                <View style={styles.locationDropdownList}>
                  {locations.map((location) => (
                    <TouchableOpacity
                      key={location.id}
                      style={[
                        styles.locationDropdownItem,
                        selectedLocation === location.name &&
                          styles.locationDropdownItemSelected,
                      ]}
                      onPress={() => selectLocation(location.name)}
                    >
                      <Text
                        style={[
                          styles.locationDropdownItemText,
                          selectedLocation === location.name &&
                            styles.locationDropdownItemTextSelected,
                        ]}
                      >
                        {location.name}
                      </Text>
                      {selectedLocation === location.name && (
                        <Ionicons name="checkmark" size={16} color="#6366F1" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <Button
              title="Reset Filters"
              onPress={handleReset}
              variant="secondary"
              size="lg"
              style={styles.modalButton}
            />
            <Button
              title="Apply"
              onPress={applyFilters}
              variant="primary"
              size="lg"
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FilterModal;
