<template>
  <!-- Editor Page -->
  <editor-page ref="editor"
               :type="EDocumentType.connection"
               :form="form"
               :apply="applyValues"
               :create="createConnection"
               :update="updateConnection">
    <!-- Form -->
    <q-form ref="form"
            @submit="editor?.save()">
      <!-- Hidden submit button -->
      <input type="submit" class="hidden" />
      <!-- Main DIV -->
      <div class="q-col-gutter-y-md">
        <!-- Name & Application Row -->
        <div class="row q-col-gutter-x-md">
          <!-- Name Column -->
          <div class="col-3">
            <!-- Name Input -->
            <field-input v-model="connectionName"
                         :label="$t('connection.label.name')"
                         :readonly="mode === tp.EEditorMode.view"
                         mandatory
                         auto-focus />
          </div>
          <!-- Application Column -->
          <div class="col-3">
            <field-select v-model="connectionApplication"
                          :label="$t('connection.label.application')"
                          :options="getApplicationOptions()"
                          :readonly="mode !== EEditorMode.create"
                          translate
                          show-icons />
          </div>
        </div>

        <!-- Description Row -->
        <div class="row">
          <!-- Description Column -->
          <div class="col">
            <!-- Description Input -->
            <field-input v-model="connectionDescription"
                         :label="$t('label.description')"
                         :readonly="mode === tp.EEditorMode.view"
                         type="textarea" />
          </div>
        </div>

        <!-- Tabs Row -->
        <div class="row">
          <!-- Tabs Column -->
          <div class="col">
            <!-- Tab Definitions -->
            <q-tabs v-model="currentTabName" align="left" no-caps dense>
              <!-- Connection Properties Tab Definition -->
              <q-tab name="properties" :label="$t('connection.label.properties')" />
              <!-- Custom Attributes Tab Definition -->
              <q-tab name="attributes" :label="$t('label.customAttributes')" />
              <!-- Connection Details -->
              <q-tab name="details" :label="$t('label.details')" v-if="mode !== tp.EEditorMode.create" />
            </q-tabs>
            <!-- Tab Panels -->
            <q-tab-panels v-model="currentTabName" keep-alive>
              <!-- Connection Properties Tab Panel -->
              <q-tab-panel name="properties">
                <!-- Amazon AWS S3 Bucket -->
                <connection-properties-s3 v-if="connectionApplication === conn.EConnectionApplication.s3"
                                          v-model="connectionProperties[conn.EConnectionApplication.s3] as conn.TConnectionPropertiesS3"
                                          :readonly="mode === EEditorMode.view" />
                <!-- Snowflake Database -->
                <connection-properties-snowflake v-if="connectionApplication === conn.EConnectionApplication.snowflake"
                                                 v-model="connectionProperties[conn.EConnectionApplication.snowflake] as conn.TConnectionPropertiesSnowflake"
                                                 :readonly="mode === EEditorMode.view" />
              </q-tab-panel>
              <!-- Custom Attributes Tab Panel -->
              <q-tab-panel name="attributes">
                <!-- Custom Attributes Table -->
                <custom-attributes-table :attributes="connectionAttributes"
                                         :readonly="mode === tp.EEditorMode.view" />
              </q-tab-panel>
              <!-- Connection Details -->
              <q-tab-panel name="details">
                <document-details :data="connectionDetails as TDocumentMetaData" />
              </q-tab-panel>
            </q-tab-panels>
          </div>
        </div>

      </div>
    </q-form>
  </editor-page>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">
import { useComposables } from 'src/scripts/util/composables';
import EditorPage from 'components/app/EditorPage.vue';
import * as tp from 'src/scripts/util/types';
import { EDocumentType, EEditorMode, TDocumentAttribute } from 'src/scripts/util/types';
import { QForm } from 'quasar';
import { onBeforeMount, ref } from 'vue';
import { FirestoreDocument, TDocumentMetaData } from 'src/scripts/firestore/firestore-document';
import * as conn from 'src/scripts/firestore/connection';
import FieldInput from 'components/common/FieldInput.vue';
import FieldSelect from 'components/common/FieldSelect.vue';
import { getApplicationOptions, getLanguageOptions } from 'src/scripts/config/options';
import ConnectionPropertiesS3 from 'components/app/connection/ConnectionPropertiesS3.vue';
import { Project } from 'src/scripts/firestore/project';
import { copyAttributes } from 'src/scripts/util/utilities';
import ConnectionPropertiesSnowflake from 'components/app/connection/ConnectionPropertiesSnowflake.vue';
import CustomAttributesTable from 'components/app/CustomAttributesTable.vue';
import DocumentDetails from 'components/app/DocumentDetails.vue';

// Composable
const cmp = useComposables();

// Editor reference
const editor = ref<typeof EditorPage | null>(null);
// Form reference
const form = ref<QForm | null>(null);

// Editor mode
const mode = cmp.sessionStore.queryParams.mode as EEditorMode;
// Current tab name
const currentTabName = ref('properties');

// Connection Name
const connectionName = ref('');
// Connection Application
const connectionApplication = ref<conn.EConnectionApplication>(conn.EConnectionApplication.s3);
// Connection Description
const connectionDescription = ref<string | null>(null);
// Connection Properties
const connectionProperties = ref<{ [key: string]: conn.TConnectionProperties }>({});
// Connection custom attributes
const connectionAttributes = ref<TDocumentAttribute[]>([]);
// Connection Details
const connectionDetails = ref<TDocumentMetaData | null>(null);

/**
 * Lifecycle event method called before this component is mounted.
 */
onBeforeMount(() => {
  // Initialize properties for AWS S3 Bucket
  connectionProperties.value[conn.EConnectionApplication.s3] = {
    region: getDefaultAWSRegion(), bucket: '', accessKeyId: '', secretAccessKey: ''
  } as conn.TConnectionPropertiesS3;
  // Initialize properties for Snowflake Database
  connectionProperties.value[conn.EConnectionApplication.snowflake] = {
    account: '', username: '', password: '', database: '', warehouse: '', role: ''
  } as conn.TConnectionPropertiesSnowflake;
});

/**
 * Applies values to fields based on the selected mode and id.
 *
 * @param {EEditorMode} mode - The editor mode.
 * @param {string} [id] - The id of the connection document. Optional if mode is not equal to EEditorMode.edit.
 *
 * @returns {void}
 */
function applyValues(mode: EEditorMode, id?: string): void {
  if (mode !== EEditorMode.create) {
    // Get the active project
    const project = cmp.sessionStore.project;
    if (project) {
      // Get the connection document
      const connection = project.getDocument<conn.IConnectionData, conn.Connection>(EDocumentType.connection, id as string);
      // Apply values
      connectionName.value = connection.data.common.name;
      connectionDescription.value = connection.data.common.description;
      connectionApplication.value = connection.data.application;
      // Apply properties for AWS S3 Bucket
      connectionProperties.value[connectionApplication.value] = { ...connection.data.properties };
      // Copy custom attributes
      connectionAttributes.value = copyAttributes(connection.data.attributes);
      // Get connection details
      connectionDetails.value = connection.data;
    }
  }
}

/**
 * Creates a new connection document based on the provided input values.
 *
 * @returns {Promise<FirestoreDocument<IConnectionData>>} A promise that resolves to the created connection document.
 */
async function createConnection(): Promise<FirestoreDocument<conn.IConnectionData>> {
  // Get the active project
  const project = cmp.sessionStore.project as Project;
  // Get the connection properties
  const properties = connectionProperties.value[connectionApplication.value];
  // Create the connection document
  const document = await conn.Connection.createConnection(
    project,
    connectionName.value,
    connectionDescription.value,
    connectionApplication.value,
    properties,
    connectionAttributes.value
  );
  // Add document to project
  project.addDocument(document);
  // Return the document
  return document;
}

/**
 * Updates the connection with the given ID.
 *
 * @param {string} id - The ID of the connection to update.
 *
 * @return {Promise<void>} A Promise that resolves when the connection is updated.
 */
async function updateConnection(id: string): Promise<void> {
  // Get the active project
  const project = cmp.sessionStore.project as Project;
  // Get the connection document
  const connection = project.getDocument<conn.IConnectionData, conn.Connection>(EDocumentType.connection, id as string);
  // Apply values
  connection.data.common.name = connectionName.value;
  connection.data.common.description = connectionDescription.value;
  // Apply properties for AWS S3
  connection.data.properties = connectionProperties.value[connection.data.application];
  // Apply attributes
  connection.data.attributes = connectionAttributes.value;
  // Update the connection document
  await conn.Connection.updateConnection(connection);
}

/**
 * Retrieves the default AWS region based on the account's language preferences.
 *
 * @returns {string} The default AWS region.
 */
function getDefaultAWSRegion(): string {
  // Get account language
  const language = cmp.sessionStore.account?.data.preferences.uiLanguage;
  if (language) {
    // Get language options
    const options = getLanguageOptions();
    // Get the region for the language
    const region = options.find(opt => opt.value === language)?.data.awsRegion;
    if (region) {
      // Return region
      return region;
    }
  }
  // Return default region
  return 'us-east-1';
}

</script>
