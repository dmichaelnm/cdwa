import { EProjectMemberRole, EUILanguage } from 'src/scripts/util/types';
import * as flags from 'quasar-extras-svg-icons/country-flag-icons';

/**
 * Type of selection option for a dropdown or select component.
 */
export type TSelectionOption<T> = {
  // Selection Value
  value: T;
  // Selection Label
  label: string;
  // Optional Icon
  icon?: string;
};

/**
 * Retrieves the available language options for the UI.
 *
 * @return {TSelectionOption<EUILanguage>[]} The array of language options.
 */
export function getLanguageOptions(): TSelectionOption<EUILanguage>[] {
  return [
    // English
    { value: EUILanguage.enUS, label: 'language.enUS', icon: flags.flagUS },
    // German
    { value: EUILanguage.deDE, label: 'language.deDE', icon: flags.flagDE }
  ];
}

/**
 * Retrieves the available role options for project members.
 *
 * @returns {TSelectionOption<EProjectMemberRole>[]} An array of selection options for project member roles
 */
export function getRoleOptions(): TSelectionOption<EProjectMemberRole>[] {
  return [
    // Visitor
    { value: EProjectMemberRole.visitor, label: 'enum.role.visitor' },
    // Developer
    { value: EProjectMemberRole.developer, label: 'enum.role.developer' },
    // Deployer
    { value: EProjectMemberRole.deployer, label: 'enum.role.deployer' },
    // Maintainer
    { value: EProjectMemberRole.maintainer, label: 'enum.role.maintainer' }
  ] ;
}
