import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { BlockProps } from './types';
import { Edit } from './edit';
import { Save } from './save';
import metadata from '../block.json';

registerBlockType(
    metadata as BlockConfiguration<BlockProps>,
    {
        edit: Edit,
        save: Save
    }
);