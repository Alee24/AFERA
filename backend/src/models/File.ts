import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export enum FileType {
  PDF = 'pdf',
  PPT = 'ppt',
}

class File extends Model {
  public id!: string;
  public url!: string;
  public file_type!: FileType;
  public language!: string;
  public post_id?: string;
  public course_id?: string;
  public uploaded_by!: string;
}

File.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    url: { type: DataTypes.STRING, allowNull: false },
    file_type: {
      type: DataTypes.ENUM(...Object.values(FileType)),
      allowNull: false,
    },
    language: { type: DataTypes.STRING, allowNull: false },
    post_id: { type: DataTypes.UUID, allowNull: true },
    course_id: { type: DataTypes.UUID, allowNull: true },
    uploaded_by: { type: DataTypes.UUID, allowNull: false },
  },
  {
    sequelize,
    modelName: 'File',
    tableName: 'files',
    timestamps: true,
    underscored: true,
  }
);

export default File;
