module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'GoBarber',
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
