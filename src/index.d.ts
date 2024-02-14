type Prettify<TObj> = {
	[K in keyof TObj]: TObj[K];
	// eslint-disable-next-line @typescript-eslint/ban-types
} & {};
