import { Suggestion } from 'use-places-autocomplete';

/**
 * Base properties that are required for the address input to work when prefilling the form with an existing address.
 * These properties are returned when **new** address is selected and also when user does not change the preffilled address when editing an existing record.
 */
export type AddressInputBase = {
  /**
   * Google Place ID
   * Required for setting default value (e.g. when editing an existing record)
   */
  placeId: string;
  /**
   * Full address to be displayed as selected option
   * Required for setting default value (e.g. when editing an existing record)
   */
  description: string;
};

/**
 * Properties that are returned when **new** address is selected.
 * When prefilling the form with an existing address and when user does not change that address, these properties are **not** returned.
 * When prefilling the form with an existing address and user changes that address, these properties **are** returned.
 */
export type AddressOutput = AddressInputBase & {
  /**
   * The whole original suggestion object provided by the Google Places API
   */
  suggestion: Suggestion;
  /**
   * Coordinates of the address
   * Added automatically when `enableGeocoding` is true
   */
  coordinates?: {
    latitude: number;
    longitude?: number;
  };
};
