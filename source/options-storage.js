import OptionsSync from "webext-options-sync";

export default new OptionsSync({
	migrations: [OptionsSync.migrations.removeUnused],
	logging: true,
});
