export default function (schema, options) {
	// agrego al schema el campo active
	schema.add({ active: { type: Boolean, default: true } })

	// filtro siempre los que esten activos
	schema.pre('find', function () {
		this.where({ active: true });
	})
}
