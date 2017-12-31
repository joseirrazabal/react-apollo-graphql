import pubsub from '../pubsub'

export default async function(Obj, args, channel) {
	const model = new Obj(args);
	const newObj = await model.save();

	if (!newObj) {
		throw new Error('Error al guardar');
	}

	if (channel) {
		const { _id, __v, ...rest } = newObj._doc

		let objSub = {}
		objSub['channel'] = channel
		objSub[channel] = { id: newObj._id, ...rest }

		pubsub.publish(objSub);
	}

	return newObj
}