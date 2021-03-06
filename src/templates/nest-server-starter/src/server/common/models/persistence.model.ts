import { CorePersistenceModel } from '@lenne.tech/nest-server';
import { Field, ObjectType } from 'type-graphql';
import { Column } from 'typeorm';
import { Editor } from './editor.model';

/**
 * Metadata for persistent objects
 *
 * The models are a combination of TypeORM Entities and TypeGraphQL Types
 */
@ObjectType({
  description: 'Persistence model which will be saved in DB',
  isAbstract: true,
})
export abstract class PersistenceModel extends CorePersistenceModel {
  /**
   * Editor who created the object
   *
   * Not set when created by system
   */
  @Field(type => Editor, {
    description: 'Editor who created the object',
    nullable: true,
  })
  @Column('varchar')
  createdBy?: string | Editor;

  /**
   * Editor who last updated the object
   *
   * Not set when updated by system
   */
  @Field(type => Editor, {
    description: 'Editor who last updated the object',
    nullable: true,
  })
  @Column('varchar')
  updatedBy?: string | Editor;
}
