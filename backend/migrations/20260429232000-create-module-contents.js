'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('module_contents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      module_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'course_modules',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      type: {
        type: Sequelize.ENUM('text', 'video', 'h5p', 'document'),
        allowNull: false
      },
      title_en: {
        type: Sequelize.STRING,
        allowNull: false
      },
      title_fr: {
        type: Sequelize.STRING,
        allowNull: true
      },
      title_pt: {
        type: Sequelize.STRING,
        allowNull: true
      },
      title_sw: {
        type: Sequelize.STRING,
        allowNull: true
      },
      content_en: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      content_fr: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      content_pt: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      content_sw: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      video_url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      h5p_data: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      order: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      is_required: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('module_contents');
  }
};
