import pubsub from '../pubsub'

export default async function(Obj, args, channel) {
	const model = new Obj(args);
	const newObj = await model.save();

	if (!newObj) {
		throw new Error('Error al guardar');
	}

	if (channel) {
		let objSub = {}
		objSub['channel'] = channel
		objSub[channel] = { newObj }

		pubsub.publish({ objSub  });
	}

	return newObj
}