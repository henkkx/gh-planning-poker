class AnyInt(object):
    def __eq__(self, other):
        return isinstance(other, int)
