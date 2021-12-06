class AnyArg(object):
    def __eq__(self, other):
        return True


class AnyInt(AnyArg):
    def __eq__(self, other):
        return isinstance(other, int)
