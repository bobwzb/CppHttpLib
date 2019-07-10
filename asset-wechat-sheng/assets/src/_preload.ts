// Some important stuff should be done before everything else.
import * as Long from "long";
import * as $protobuf from "protobufjs/minimal";

export function preInit() {
	console.log("set protobufjs's util.Long");
	if ($protobuf.util.Long === null) {
		$protobuf.util.Long = Long;
		$protobuf.configure();
	}
}

preInit();
