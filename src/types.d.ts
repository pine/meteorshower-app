interface Repository {
  owner: string
  name: string
}

interface Configuration {
  exclude: ExcludePattern[]
}

interface ExcludedPattern {
  owner: string
  name?: string
}

// vim: se et ts=2 sw=2 sts=2 ft=typescript :
