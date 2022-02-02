{{- $chart := .Chart }}
{{- $release := .Release }}
{{- $values := .Values }}
{{- range $name, $configuration := .Values.workers }}
{{- if $configuration.hpa }}
{{- $dict := dict "" "" }}
{{- $_ := set $dict "command" $configuration.command }}
{{- $_ = set $dict "env" $configuration }}
{{- $_ = set $dict "Chart" $chart }}
{{- $_ = set $dict "Release" $release }}
{{- $_ = set $dict "Values" $values }}
{{- template "hpa.tpl" $dict }}
{{- end }}
{{- end }}
