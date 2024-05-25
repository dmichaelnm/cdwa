import { EDocumentAttributeType, EProjectMemberRole, EUILanguage } from 'src/scripts/util/types';
import * as flags from 'quasar-extras-svg-icons/country-flag-icons';
import { EConnectionApplication } from 'src/scripts/firestore/connection';
import { EDiagramType } from 'src/scripts/firestore/diagram';

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
  // Optional user data
  data?: any;
};

/**
 * Retrieves the available language options for the UI.
 *
 * @return {TSelectionOption<EUILanguage>[]} The array of language options.
 */
export function getLanguageOptions(): TSelectionOption<EUILanguage>[] {
  return [
    // English
    { value: EUILanguage.enUS, label: 'language.enUS', icon: flags.flagUS, data: { awsRegion: 'us-east-1' } },
    // German
    { value: EUILanguage.deDE, label: 'language.deDE', icon: flags.flagDE, data: { awsRegion: 'eu-central-1' } }
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
  ];
}

/**
 * Retrieves an array of selection options that represent the available document attribute types.
 *
 * @returns {TSelectionOption<EDocumentAttributeType>[]} An array of selection options.
 */
export function getTypeOptions(): TSelectionOption<EDocumentAttributeType>[] {
  return [
    // String
    { value: EDocumentAttributeType.string, label: 'enum.type.string' },
    // Number
    { value: EDocumentAttributeType.number, label: 'enum.type.number' },
    // Boolean
    { value: EDocumentAttributeType.boolean, label: 'enum.type.boolean' }
  ];
}

/**
 * Retrieves the options for the supported applications.
 *
 * @returns {Array<TSelectionOption<EConnectionApplication>>} The list of available application options
 */
export function getApplicationOptions(): TSelectionOption<EConnectionApplication>[] {
  return [
    // Amazon S3 Bucket
    { value: EConnectionApplication.s3, label: 'enum.application.s3', icon: 'img:system/s3.png' },
    // Snowflake Database
    { value: EConnectionApplication.snowflake, label: 'enum.application.snowflake', icon: 'img:system/snowflake.png' }
  ];
}

/**
 * Retrieves a list of AWS regions.
 *
 * @return {TSelectionOption<string>[]} An array of objects representing AWS regions.
 */
export function getAWSRegions(): TSelectionOption<string>[] {
  return [
    { value: 'us-east-1', label: 'US East (N. Virginia)' },
    { value: 'us-east-2', label: 'US East (Ohio)' },
    { value: 'us-west-1', label: 'US West (N. California)' },
    { value: 'us-west-2', label: 'US West (Oregon)' },
    { value: 'af-south-1', label: 'Africa (Cape Town)' },
    { value: 'ap-east-1', label: 'Asia Pacific (Hong Kong)' },
    { value: 'ap-south-2', label: 'Asia Pacific (Hyderabad)' },
    { value: 'ap-southeast-3', label: 'Asia Pacific (Jakarta)' },
    { value: 'ap-southeast-4', label: 'Asia Pacific (Melbourne)' },
    { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
    { value: 'ap-northeast-3', label: 'Asia Pacific (Osaka)' },
    { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)' },
    { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
    { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
    { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
    { value: 'ca-central-1', label: 'Canada (Central)' },
    { value: 'ca-west-1', label: 'Canada West (Calgary)' },
    { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
    { value: 'eu-west-1', label: 'Europe (Ireland)' },
    { value: 'eu-west-2', label: 'Europe (London)' },
    { value: 'eu-south-1', label: 'Europe (Milan)' },
    { value: 'eu-west-3', label: 'Europe (Paris)' },
    { value: 'eu-south-2', label: 'Europe (Spain)' },
    { value: 'eu-north-1', label: 'Europe (Stockholm)' },
    { value: 'eu-central-2', label: 'Europe (Zurich)' },
    { value: 'il-central-1', label: 'Israel (Tel Aviv)' },
    { value: 'me-south-1', label: 'Middle East (Bahrain)' },
    { value: 'me-central-1', label: 'Middle East (UAE)' },
    { value: 'sa-east-1', label: 'South America (São Paulo)' },
    { value: 'us-gov-east-1', label: 'AWS GovCloud (US-East)' },
    { value: 'us-gov-west-1', label: 'AWS GovCloud (US-West)' }
  ];
}

/**
 * Retrieves the options for diagram types.
 *
 * @return {TSelectionOption<EDiagramType>[]} An array of diagram type options.
 */
export function getDiagramTypeOptions(): TSelectionOption<EDiagramType>[] {
  return [
    // Architecture Model
    { value: EDiagramType.architecture, label: 'enum.diagram.architecture', icon: 'domain' }
  ];
}
