import ServerSideRender from '@wordpress/server-side-render';
import { useBlockProps, InspectorControls, InspectorAdvancedControls } from '@wordpress/block-editor';
import { PanelBody, SelectControl, Spinner, ToggleControl, TextControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { BlockEditProps } from '@wordpress/blocks';
import { BlockProps } from '@/types';

export const Edit = ({ attributes, setAttributes }: BlockEditProps<BlockProps>) => {
    const { postType, mode, customPostId, showCount, activePostClassName } = attributes;

    const blockProps = useBlockProps();

    const { postTypes, isPostTypesLoading } = useSelect((select) => {
        const { getPostTypes, isResolving } = select('core');
        // @ts-ignore
        const types = getPostTypes({ per_page: -1 });

        return {
            postTypes: types?.filter((type: any) => type.viewable),
            // @ts-ignore
            isPostTypesLoading: isResolving('core', 'getPostTypes', [{ per_page: -1 }]),
        };
    }, []);

    const postTypeOptions = postTypes ? postTypes.map((type: any) => ({
        label: type.labels.singular_name || type.slug,
        value: type.slug,
    })) : [];


    const posts = useSelect((select) => {
        const { getEntityRecords } = select('core');
        // @ts-ignore
        const records = getEntityRecords('postType', postType, { per_page: 100 });
        return records;
    }, [postType]);

    // @ts-ignore
    const postOptions = posts ? posts.map((post) => ({
        label: post.title.rendered,
        value: post.id,
    })) : [];
    
    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings">
                    {
                        isPostTypesLoading ? 
                        (
                            <Spinner />
                        ) : (
                            <SelectControl
                                label="Post Type"
                                value={postType}
                                options={postTypeOptions}
                                onChange={(value) => setAttributes({ postType: value })}
                                __next40pxDefaultSize 
                                __nextHasNoMarginBottom
                            />
                        )
                    }
                    <SelectControl
                        label="Mode"
                        value={mode}
                        options={[
                            { label: 'All', value: 'all' },
                            { label: 'Custom post', value: 'custom' },
                            { label: 'Auto', value: 'auto' },
                        ]}
                        onChange={(val) => setAttributes({ mode: val as any })}
                        __next40pxDefaultSize 
                        __nextHasNoMarginBottom
                    />

                    {
                        attributes.mode === 'custom' && 
                        (
                            postOptions.length === 0 ? 
                            (
                                <Spinner /> 
                            ) : (
                                <SelectControl
                                    label="Select a Post"
                                    value={`${customPostId}`}
                                    options={[
                                        { label: 'Select a post...', value: 0 },
                                        ...postOptions,
                                    ]}
                                    onChange={(val) => setAttributes({ customPostId: val as any })}
                                    __next40pxDefaultSize 
                                    __nextHasNoMarginBottom
                                />
                            )
                        )
                    }
                    <ToggleControl
                        label="Show child count"
                        checked={showCount}
                        onChange={(value) => setAttributes({ showCount: value })}
                        __nextHasNoMarginBottom
                    />
                </PanelBody>
            </InspectorControls>
            <InspectorAdvancedControls>
                <TextControl
                    label="Active item CSS class"
                    value={activePostClassName || ''}
                    onChange={(value) => setAttributes({ activePostClassName: value })}
                    help="Class applied to the current/active post."
                />
            </InspectorAdvancedControls>

            <div {...blockProps}>
				<ServerSideRender
					block="post-hierarchy-nav/navigation"
					attributes={attributes}
				/>
			</div>
        </>
    );
}